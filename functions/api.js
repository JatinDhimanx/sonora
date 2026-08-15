const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const YTMusic = require("ytmusic-api");

const CACHE_TTL = 1000 * 60 * 10;
const app = express();

app.use(cors());
app.use(express.json());

const ytmusic = new YTMusic();
let ready = false;
let initPromise = null;

async function ensureReady() {
  if (ready) return;
  if (!initPromise) {
    initPromise = ytmusic
      .initialize()
      .then(() => {
        ready = true;
      })
      .catch((err) => {
        initPromise = null;
        throw err;
      });
  }
  await initPromise;
}

async function requireReady(req, res, next) {
  try {
    await ensureReady();
    next();
  } catch (err) {
    res.status(503).json({ error: "Backend initializing, please retry." });
  }
}

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const cache = new Map();

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return undefined;
  }
  return hit.value;
}

function cacheSet(key, value) {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL });
}

function bestThumb(thumbs) {
  if (!Array.isArray(thumbs) || !thumbs.length) return "";
  return thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || "";
}

function mapSong(s) {
  return {
    videoId: s.videoId,
    name: s.name || "Untitled Track",
    artist: s.artist?.name || (Array.isArray(s.artists) ? s.artists.map((a) => a.name).join(", ") : "Unknown Artist"),
    artistId: s.artist?.artistId || s.artists?.[0]?.artistId || null,
    album: s.album?.name || "",
    albumId: s.album?.albumId || null,
    duration: s.duration || 0,
    thumbnail: bestThumb(s.thumbnails),
  };
}

function mapArtist(a) {
  return {
    artistId: a.artistId,
    name: a.name || "Unknown Artist",
    thumbnail: bestThumb(a.thumbnails),
  };
}

function mapAlbum(al) {
  return {
    albumId: al.albumId,
    name: al.name || "Untitled Album",
    artist: al.artist?.name || (Array.isArray(al.artists) ? al.artists.map((a) => a.name).join(", ") : "Various Artists"),
    year: al.year || "",
    type: al.type || "Album",
    thumbnail: bestThumb(al.thumbnails),
  };
}

function mapPlaylist(p) {
  return {
    playlistId: p.playlistId,
    name: p.name || "Playlist",
    author: p.author?.name || p.author || "YT Music",
    count: p.count || "",
    thumbnail: bestThumb(p.thumbnails),
  };
}

async function cached(key, loader) {
  const hit = cacheGet(key);
  if (hit !== undefined) return hit;
  const value = await loader();
  cacheSet(key, value);
  return value;
}

const router = express.Router();

router.get(
  "/suggestions",
  requireReady,
  wrap(async (req, res) => {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const suggestions = await cached(`sugg:${q}`, () => ytmusic.getSearchSuggestions(q));
    res.json(suggestions || []);
  })
);

router.get(
  "/search",
  requireReady,
  wrap(async (req, res) => {
    const q = (req.query.q || "").trim();
    const type = (req.query.type || "all").toLowerCase();
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const cacheKey = `search:${type}:${q}`;
    const hit = cacheGet(cacheKey);
    if (hit !== undefined) return res.json(hit);

    let payload;

    if (type === "songs") {
      payload = (await ytmusic.searchSongs(q)).slice(0, 30).map(mapSong);
    } else if (type === "artists") {
      payload = (await ytmusic.searchArtists(q)).slice(0, 10).map(mapArtist);
    } else if (type === "albums") {
      payload = (await ytmusic.searchAlbums(q)).slice(0, 10).map(mapAlbum);
    } else if (type === "playlists") {
      payload = (await ytmusic.searchPlaylists(q)).slice(0, 10).map(mapPlaylist);
    } else {
      const [songsR, artistsR, albumsR, playlistsR] = await Promise.allSettled([
        ytmusic.searchSongs(q),
        ytmusic.searchArtists(q),
        ytmusic.searchAlbums(q),
        ytmusic.searchPlaylists(q),
      ]);

      const songs = songsR.status === "fulfilled" ? songsR.value.slice(0, 15).map(mapSong) : [];
      const artists = artistsR.status === "fulfilled" ? artistsR.value.slice(0, 6).map(mapArtist) : [];
      const albums = albumsR.status === "fulfilled" ? albumsR.value.slice(0, 6).map(mapAlbum) : [];
      const playlists = playlistsR.status === "fulfilled" ? playlistsR.value.slice(0, 6).map(mapPlaylist) : [];

      let topResult = null;
      if (artists[0] && artists[0].name.toLowerCase().includes(q.toLowerCase())) {
        topResult = { type: "artist", ...artists[0] };
      } else if (songs[0]) {
        topResult = { type: "song", ...songs[0] };
      } else if (albums[0]) {
        topResult = { type: "album", ...albums[0] };
      }

      payload = { topResult, songs, artists, albums, playlists };
    }

    cacheSet(cacheKey, payload);
    res.json(payload);
  })
);

router.get(
  "/song/:id",
  requireReady,
  wrap(async (req, res) => {
    const song = await cached(`song:${req.params.id}`, () => ytmusic.getSong(req.params.id));
    res.json(song);
  })
);

router.get(
  "/lyrics/:id",
  requireReady,
  wrap(async (req, res) => {
    try {
      const lyrics = await cached(`lyrics:${req.params.id}`, () => ytmusic.getLyrics(req.params.id));
      res.json({ lyrics: lyrics || [] });
    } catch (err) {
      res.status(200).json({ lyrics: [] });
    }
  })
);

router.get(
  "/upnext/:id",
  requireReady,
  wrap(async (req, res) => {
    const upNext = await ytmusic.getUpNexts(req.params.id);
    res.json(upNext || []);
  })
);

router.get(
  "/artist/:id",
  requireReady,
  wrap(async (req, res) => {
    const artist = await cached(`artist:${req.params.id}`, () => ytmusic.getArtist(req.params.id));
    res.json(artist);
  })
);

router.get(
  "/album/:id",
  requireReady,
  wrap(async (req, res) => {
    const album = await cached(`album:${req.params.id}`, () => ytmusic.getAlbum(req.params.id));
    res.json(album);
  })
);

router.get(
  "/playlist/:id",
  requireReady,
  wrap(async (req, res) => {
    const playlist = await cached(`playlist:${req.params.id}`, () => ytmusic.getPlaylist(req.params.id));
    res.json(playlist);
  })
);

router.get("/health", (req, res) => {
  res.json({ ready, cacheSize: cache.size });
});

app.use("/.netlify/functions/api", router);
app.use("/api", router);

module.exports.handler = serverless(app);
