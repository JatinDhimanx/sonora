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
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    let payload;

    if (type === "songs") {
      const cacheKey = `search:songs:${q}`;
      let allSongs = cacheGet(cacheKey);
      if (allSongs === undefined) {
        allSongs = (await ytmusic.searchSongs(q)).map(mapSong);
        cacheSet(cacheKey, allSongs);
      }
      const page = allSongs.slice(offset, offset + limit);
      payload = { songs: page, total: allSongs.length, offset, limit, hasMore: offset + limit < allSongs.length };
    } else if (type === "artists") {
      const cacheKey = `search:artists:${q}`;
      let hit = cacheGet(cacheKey);
      if (hit === undefined) {
        hit = (await ytmusic.searchArtists(q)).slice(0, 20).map(mapArtist);
        cacheSet(cacheKey, hit);
      }
      payload = hit;
    } else if (type === "albums") {
      const cacheKey = `search:albums:${q}`;
      let allAlbums = cacheGet(cacheKey);
      if (allAlbums === undefined) {
        allAlbums = (await ytmusic.searchAlbums(q)).map(mapAlbum);
        cacheSet(cacheKey, allAlbums);
      }
      const page = allAlbums.slice(offset, offset + limit);
      payload = { albums: page, total: allAlbums.length, offset, limit, hasMore: offset + limit < allAlbums.length };
    } else if (type === "playlists") {
      const cacheKey = `search:playlists:${q}`;
      let hit = cacheGet(cacheKey);
      if (hit === undefined) {
        hit = (await ytmusic.searchPlaylists(q)).slice(0, 20).map(mapPlaylist);
        cacheSet(cacheKey, hit);
      }
      payload = hit;
    } else {
      const cacheKey = `search:all:${q}`;
      let hit = cacheGet(cacheKey);
      if (hit !== undefined) return res.json(hit);

      const [songsR, artistsR, albumsR, playlistsR] = await Promise.allSettled([
        ytmusic.searchSongs(q),
        ytmusic.searchArtists(q),
        ytmusic.searchAlbums(q),
        ytmusic.searchPlaylists(q),
      ]);

      let songs = songsR.status === "fulfilled" ? songsR.value.slice(0, 20).map(mapSong) : [];
      let artists = artistsR.status === "fulfilled" ? artistsR.value.slice(0, 6).map(mapArtist) : [];
      let albums = albumsR.status === "fulfilled" ? albumsR.value.slice(0, 8).map(mapAlbum) : [];
      let playlists = playlistsR.status === "fulfilled" ? playlistsR.value.slice(0, 8).map(mapPlaylist) : [];

      if (albums.length < 3 && songs.length > 0) {
        const seenAlbums = new Set(albums.map(a => (a.name || '').toLowerCase()));
        songs.forEach(s => {
          if (s.album && s.album !== 'Single' && !seenAlbums.has(s.album.toLowerCase())) {
            seenAlbums.add(s.album.toLowerCase());
            albums.push({
              albumId: s.albumId || null,
              name: s.album,
              artist: s.artist,
              year: "",
              type: "Album",
              thumbnail: s.thumbnail
            });
          }
        });
      }

      if (playlists.length < 3 && songs.length > 0) {
        try {
          const extraPl = await ytmusic.searchPlaylists(`${q} playlist`);
          if (Array.isArray(extraPl) && extraPl.length) {
            const seenPl = new Set(playlists.map(p => (p.name || '').toLowerCase()));
            extraPl.slice(0, 6).forEach(p => {
              const mapped = mapPlaylist(p);
              if (!seenPl.has((mapped.name || '').toLowerCase())) {
                seenPl.add((mapped.name || '').toLowerCase());
                playlists.push(mapped);
              }
            });
          }
        } catch (e) { }
      }

      let topResult = null;
      if (artists[0] && artists[0].name.toLowerCase().includes(q.toLowerCase())) {
        topResult = { type: "artist", ...artists[0] };
      } else if (songs[0]) {
        topResult = { type: "song", ...songs[0] };
      } else if (albums[0]) {
        topResult = { type: "album", ...albums[0] };
      }

      payload = { topResult, songs, artists, albums, playlists };
      cacheSet(cacheKey, payload);
    }

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

const INSTANT_GLOBAL_HITS = [
  { videoId: "dQw4w9WgXcQ", name: "Still Water", artist: "Mara Vale", album: "Tide Lines", duration: 232, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
  { videoId: "hT_nvWreIhg", name: "Counting Stars", artist: "OneRepublic", album: "Native", duration: 257, thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
  { videoId: "YQHsXMglC9A", name: "Adele - Hello", artist: "Adele", album: "25", duration: 295, thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
  { videoId: "OPf0YbXqDm0", name: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special", duration: 270, thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" },
  { videoId: "09R8_2nJtjg", name: "Sugar", artist: "Maroon 5", album: "V", duration: 235, thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
  { videoId: "kJQP7kiw5Fk", name: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "Vida", duration: 228, thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
  { videoId: "2Vv-BfVoq4g", name: "Perfect", artist: "Ed Sheeran", album: "÷ (Divide)", duration: 263, thumbnail: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80" },
  { videoId: "CevxZvSJLk8", name: "Roar", artist: "Katy Perry", album: "Prism", duration: 222, thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80" },
  { videoId: "7wtfhZwyrCA", name: "Believer", artist: "Imagine Dragons", album: "Evolve", duration: 204, thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
  { videoId: "fJ9rUzIMcZQ", name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 354, thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" }
];

function shuffleFn(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

router.get(
  "/global-mix",
  wrap(async (req, res) => {
    const cacheKey = "global:mix:all";
    const hit = cacheGet(cacheKey);
    if (hit !== undefined && Array.isArray(hit) && hit.length) {
      return res.json(shuffleFn(hit));
    }
    res.json(shuffleFn(INSTANT_GLOBAL_HITS));
  })
);

router.get("/health", (req, res) => {
  res.json({ ready, cacheSize: cache.size });
});

app.use("/.netlify/functions/api", router);
app.use("/api", router);

module.exports.handler = serverless(app);
