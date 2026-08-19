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

function extractArtistName(s) {
  if (!s) return "Various Artists";
  if (typeof s === "string" && s.trim()) return s.trim();

  if (typeof s.artist === "string" && s.artist.trim()) return s.artist.trim();
  if (s.artist && typeof s.artist === "object") {
    if (typeof s.artist.name === "string" && s.artist.name.trim()) return s.artist.name.trim();
    if (typeof s.artist.title === "string" && s.artist.title.trim()) return s.artist.title.trim();
  }

  if (typeof s.artists === "string" && s.artists.trim()) return s.artists.trim();
  if (Array.isArray(s.artists) && s.artists.length) {
    const list = s.artists
      .map(a => (typeof a === "string" ? a.trim() : (a?.name || "").trim()))
      .filter(Boolean);
    if (list.length) return list.join(", ");
  }

  if (typeof s.author === "string" && s.author.trim()) return s.author.trim();
  if (s.author && typeof s.author === "object" && s.author.name) return s.author.name.trim();
  if (typeof s.uploader === "string" && s.uploader.trim()) return s.uploader.trim();
  if (typeof s.channelTitle === "string" && s.channelTitle.trim()) return s.channelTitle.trim();
  if (typeof s.channel === "string" && s.channel.trim()) return s.channel.trim();

  const title = s.name || s.title || "";
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    if (parts.length >= 2 && parts[0].trim().length > 1) {
      return parts[0].trim();
    }
  }

  return "Various Artists";
}

function mapSong(s) {
  if (!s) return null;
  return {
    videoId: s.videoId || (typeof s.id === "object" ? s.id.videoId : s.id) || "",
    name: s.name || s.title || s.heading || "Untitled Track",
    artist: extractArtistName(s),
    artistId: s.artist?.artistId || (Array.isArray(s.artists) && s.artists[0]?.artistId) || null,
    album: s.album?.name || (typeof s.album === "string" ? s.album : "Single"),
    albumId: s.album?.albumId || null,
    duration: s.duration || s.duration_seconds || s.length || 0,
    thumbnail: bestThumb(s.thumbnails) || (typeof s.thumbnail === "string" ? s.thumbnail : ""),
  };
}

function mapArtist(a) {
  return {
    artistId: a.artistId || "",
    name: a.name || a.title || "Artist",
    thumbnail: bestThumb(a.thumbnails) || (typeof a.thumbnail === "string" ? a.thumbnail : ""),
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

function normalizeLyricsQueryString(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/\s*[-|:]\s*(official|video|lyric|lyrics|audio|from|soundtrack|movie).*$/i, "")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

function cleanTrackTitle(title) {
  if (!title) return "";
  return title
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/\s*[-|:]\s*(official|music|video|lyric|lyrics|audio|visualizer|remix|slowed|reverb|full video|hd|4k|song|track).*$/i, "")
    .replace(/\b(ft\.?|feat\.?|featuring)\b.*$/i, "")
    .trim();
}

function extractPrimaryArtist(artistStr) {
  if (!artistStr) return "";
  const cleaned = artistStr.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
  const parts = cleaned.split(/[,&/]|feat\.?|ft\.?|\bwith\b|\bx\b|\band\b/i);
  return parts[0] ? parts[0].trim() : cleaned;
}

function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b || "").length;
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function calculateStringSimilarity(str1, str2) {
  const n1 = normalizeLyricsQueryString(str1);
  const n2 = normalizeLyricsQueryString(str2);
  if (n1 === n2) return 1.0;
  if (!n1 || !n2) return 0.0;
  const dist = levenshteinDistance(n1, n2);
  const maxLen = Math.max(n1.length, n2.length);
  return Math.max(0, 1 - (dist / maxLen));
}

function scoreLyricsCandidate(item, targetTitle, targetArtist, targetDuration) {
  if (!item || !item.trackName) return 0;
  const tSim = calculateStringSimilarity(item.trackName, targetTitle);
  if (tSim < 0.62) return 0;
  let score = tSim * 50;
  if (normalizeLyricsQueryString(item.trackName) === normalizeLyricsQueryString(targetTitle)) score += 20;
  if (targetArtist && item.artistName) {
    const aSim = calculateStringSimilarity(item.artistName, targetArtist);
    if (aSim >= 0.70) score += 25;
    else if (aSim < 0.25) score -= 25;
  }
  if (targetDuration > 0 && item.duration) {
    const diff = Math.abs(item.duration - targetDuration);
    if (diff <= 4) score += 20;
    else if (diff <= 10) score += 10;
    else if (diff > 25) score -= 30;
  }
  if (item.syncedLyrics) score += 10;
  return score;
}

function parseLrc(lrcText) {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result = [];
  const tagRegex = /\[(\d{1,2}):(\d{2})(?:[\.:](\d{1,3}))?\]/g;
  for (const line of lines) {
    tagRegex.lastIndex = 0;
    const matches = [...line.matchAll(tagRegex)];
    if (matches.length > 0) {
      const text = line.replace(/\[\d{1,2}:\d{2}(?:[\.:]\d{1,3})?\]/g, "").trim();
      if (text) {
        for (const match of matches) {
          const min = parseInt(match[1], 10);
          const sec = parseInt(match[2], 10);
          let ms = 0;
          if (match[3]) {
            const rawMs = match[3];
            ms = rawMs.length === 3 ? parseInt(rawMs, 10) / 1000 : parseInt(rawMs, 10) / 100;
          }
          const time = parseFloat((min * 60 + sec + ms).toFixed(2));
          result.push({ time, text });
        }
      }
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
}

function generateAutoSyncLines(plainLines, totalDuration = 0) {
  if (!Array.isArray(plainLines) || !plainLines.length) return [];
  const lines = plainLines.map(l => (typeof l === "string" ? l : (l.text || "")).trim()).filter(Boolean);
  if (!lines.length) return [];
  const dur = Number(totalDuration) > 30 ? Number(totalDuration) : 180;
  const startOffset = 6.0;
  const endOffset = Math.max(dur - 6.0, startOffset + 10.0);
  const availableTime = endOffset - startOffset;
  const step = availableTime / Math.max(lines.length, 1);
  return lines.map((text, idx) => ({
    time: parseFloat((startOffset + idx * step).toFixed(2)),
    text: text
  }));
}

async function getSyncedLyrics(title, artist, duration = 0) {
  if (!title) return null;
  try {
    const rawTitle = title.trim();
    const rawArtist = (artist || "").trim();
    const cleanTitle = cleanTrackTitle(rawTitle) || rawTitle;
    const primaryArtist = extractPrimaryArtist(rawArtist) || rawArtist;
    const targetDuration = Number(duration) || 0;

    if (cleanTitle && primaryArtist) {
      try {
        let getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(primaryArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        if (targetDuration > 0) getUrl += `&duration=${Math.round(targetDuration)}`;
        const getResp = await fetch(getUrl, { headers: { "User-Agent": "SonoraMusicApp/1.0" } });
        if (getResp.ok) {
          const data = await getResp.json();
          if (data) {
            const score = scoreLyricsCandidate(data, cleanTitle, primaryArtist, targetDuration);
            if (score >= 65) {
              if (data.syncedLyrics) {
                const parsed = parseLrc(data.syncedLyrics);
                if (parsed.length) return { synced: true, lines: parsed };
              }
              if (data.plainLyrics) {
                const plainLines = data.plainLyrics.split("\n").map(l => l.trim()).filter(Boolean);
                if (plainLines.length) {
                  return { synced: true, lines: generateAutoSyncLines(plainLines, targetDuration) };
                }
              }
            }
          }
        }
      } catch (e) { }
    }

    const searchQueries = [];
    if (cleanTitle && primaryArtist) searchQueries.push(`${cleanTitle} ${primaryArtist}`);
    if (cleanTitle && rawArtist && rawArtist !== primaryArtist) searchQueries.push(`${cleanTitle} ${rawArtist}`);
    if (cleanTitle) searchQueries.push(cleanTitle);
    if (rawTitle && rawTitle !== cleanTitle) searchQueries.push(rawTitle);

    const candidates = [];
    for (const q of searchQueries) {
      try {
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`;
        const searchResp = await fetch(searchUrl, { headers: { "User-Agent": "SonoraMusicApp/1.0" } });
        if (!searchResp.ok) continue;
        const results = await searchResp.json();
        if (!Array.isArray(results) || !results.length) continue;
        for (const item of results) {
          const score = scoreLyricsCandidate(item, cleanTitle, primaryArtist || rawArtist, targetDuration);
          if (score >= 65) candidates.push({ item, score });
        }
        if (candidates.length > 0 && candidates.some(c => c.score >= 85)) break;
      } catch (e) { }
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const bestSynced = candidates.find(c => c.item.syncedLyrics && c.score >= 65);
      if (bestSynced) {
        const parsed = parseLrc(bestSynced.item.syncedLyrics);
        if (parsed.length) return { synced: true, lines: parsed };
      }
      const bestPlain = candidates.find(c => c.item.plainLyrics && c.score >= 70);
      if (bestPlain) {
        const plainLines = bestPlain.item.plainLyrics.split("\n").map(l => l.trim()).filter(Boolean);
        if (plainLines.length) {
          return { synced: true, lines: generateAutoSyncLines(plainLines, targetDuration) };
        }
      }
    }
  } catch (e) { }
  return null;
}

router.get(
  "/lyrics/:id",
  requireReady,
  wrap(async (req, res) => {
    try {
      const videoId = req.params.id;
      const title = (req.query.title || "").trim();
      const artist = (req.query.artist || "").trim();
      const duration = parseInt(req.query.duration, 10) || 0;

      if (title) {
        try {
          const lyricsResult = await cached(`synced:${title}:${artist}:${duration}`, () => withTimeout(getSyncedLyrics(title, artist, duration), 5000));
          if (lyricsResult && Array.isArray(lyricsResult.lines) && lyricsResult.lines.length) {
            return res.json({ synced: lyricsResult.synced !== false, lines: lyricsResult.lines });
          }
        } catch (e) { }
      }

      if (videoId && videoId !== "unknown") {
        try {
          const lyrics = await cached(`lyrics:${videoId}`, () => withTimeout(ytmusic.getLyrics(videoId), 3500));
          if (Array.isArray(lyrics) && lyrics.length) {
            const plainLines = lyrics.map((text) => (typeof text === "string" ? text : text.text || "")).filter(Boolean);
            if (plainLines.length) {
              const autoSynced = generateAutoSyncLines(plainLines, duration);
              return res.json({ synced: true, lines: autoSynced });
            }
          }
        } catch (e) { }
      }

      res.json({ synced: false, lines: [] });
    } catch (err) {
      res.status(200).json({ synced: false, lines: [] });
    }
  })
);

router.get(
  "/upnext/:id",
  requireReady,
  wrap(async (req, res) => {
    const upNext = await ytmusic.getUpNexts(req.params.id);
    if (Array.isArray(upNext)) {
      return res.json(upNext.map(mapSong).filter(Boolean));
    }
    res.json([]);
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
