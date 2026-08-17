const path = require("path");
const express = require("express");
const cors = require("cors");
const YTMusic = require("ytmusic-api");
const ytdl = require("@distube/ytdl-core");

const PORT = process.env.PORT || 3000;
const CACHE_TTL = 1000 * 60 * 10;

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// 🛡️ SESSION & IP TRACKING MIDDLEWARE FOR ADMIN DASHBOARD
// ---------------------------------------------------------------------------
const activeSessions = new Map();

function parseBrowser(ua) {
  if (!ua) return { browser: 'Unknown', os: 'Unknown' };

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  let browser = 'Unknown Browser';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

  return { browser, os };
}

app.use((req, res, next) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');
    const userAgent = req.headers['user-agent'] || '';

    if (ip && !req.path.startsWith('/admin') && !req.path.startsWith('/api/admin')) {
      const parsed = parseBrowser(userAgent);
      const existing = activeSessions.get(ip) || { resetSignal: false };
      activeSessions.set(ip, {
        ip,
        browser: parsed.browser,
        os: parsed.os,
        userAgent,
        lastActive: Date.now(),
        resetSignal: existing.resetSignal || false
      });
    }
  } catch (e) {}
  next();
});

// Admin Page Route
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

// Admin APIs
app.get('/api/admin/sessions', (req, res) => {
  const sessions = Array.from(activeSessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  res.json({
    total: sessions.length,
    sessions
  });
});

app.post('/api/admin/reset-cache', (req, res) => {
  const { ip, all } = req.body || {};
  if (all) {
    for (const [sIp, s] of activeSessions) {
      s.resetSignal = true;
    }
    return res.json({ success: true, message: 'Reset signal sent to all user sessions' });
  }

  if (ip && activeSessions.has(ip)) {
    const session = activeSessions.get(ip);
    session.resetSignal = true;
    return res.json({ success: true, message: `Reset signal sent to IP ${ip}` });
  }

  res.status(400).json({ error: 'Session IP not found' });
});

app.get('/api/check-reset', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');
  const session = activeSessions.get(ip);

  if (session && session.resetSignal) {
    session.resetSignal = false;
    return res.json({ reset: true });
  }

  res.json({ reset: false });
});

app.use(express.static(path.join(__dirname, "..", "public")));

const ytmusic = new YTMusic();
let ready = false;
let initError = null;

async function boot() {
  try {
    await ytmusic.initialize();
    ready = true;
    console.log("YTMusic API ready");
  } catch (err) {
    initError = err;
    console.error("YTMusic init failed:", err.message);
    setTimeout(boot, 5000);
  }
}
boot();

function requireReady(req, res, next) {
  if (!ready) {
    return res.status(503).json({ error: initError ? "Backend unavailable, retrying..." : "Still starting up, try again in a second" });
  }
  next();
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

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expires) cache.delete(key);
  }
}, 1000 * 60 * 5).unref();

function upgradeThumbToHD(url) {
  if (!url) return "";
  let hd = url.replace(/=w\d+-h\d+/, '=w512-h512')
             .replace(/=s\d+/, '=s512')
             .replace(/=w\d+/, '=w512');
  if (hd.includes('ytimg.com')) {
    hd = hd.replace('/default.jpg', '/hqdefault.jpg')
           .replace('/sddefault.jpg', '/maxresdefault.jpg')
           .replace('/hqdefault.jpg', '/maxresdefault.jpg');
  }
  return hd;
}

function bestThumb(thumbs) {
  if (!Array.isArray(thumbs) || !thumbs.length) return "";
  const raw = thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || "";
  return upgradeThumbToHD(raw);
}

function parseLrc(lrcText) {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const msStr = match[3];
      const ms = msStr.length === 2 ? parseInt(msStr, 10) / 100 : parseInt(msStr, 10) / 1000;
      const time = min * 60 + sec + ms;
      const text = line.replace(timeRegex, "").trim();
      if (text) {
        result.push({ time, text });
      }
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

function withTimeout(promise, ms = 3500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
}

async function getSyncedLyrics(title, artist) {
  if (!title) return null;
  try {
    const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, "").trim();
    const cleanArtist = (artist || "").replace(/\(.*?\)|\[.*?\]/g, "").trim();

    // 1. Try exact get endpoint
    if (cleanArtist) {
      const getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
      const getResp = await fetch(getUrl, { headers: { "User-Agent": "SonoraMusicApp/1.0" } });
      if (getResp.ok) {
        const data = await getResp.json();
        if (data.syncedLyrics) {
          const parsed = parseLrc(data.syncedLyrics);
          if (parsed.length) return parsed;
        } else if (data.plainLyrics) {
          const lines = data.plainLyrics.split("\n").map(l => l.trim()).filter(Boolean);
          if (lines.length) return lines.map((l, i) => ({ time: i * 4, text: l }));
        }
      }
    }

    // 2. Try flexible search endpoint
    const query = `${cleanTitle} ${cleanArtist}`.trim();
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;
    const searchResp = await fetch(searchUrl, { headers: { "User-Agent": "SonoraMusicApp/1.0" } });
    if (searchResp.ok) {
      const results = await searchResp.json();
      if (Array.isArray(results) && results.length) {
        const item = results.find(r => r.syncedLyrics || r.plainLyrics) || results[0];
        if (item) {
          if (item.syncedLyrics) {
            const parsed = parseLrc(item.syncedLyrics);
            if (parsed.length) return parsed;
          } else if (item.plainLyrics) {
            const lines = item.plainLyrics.split("\n").map(l => l.trim()).filter(Boolean);
            if (lines.length) return lines.map((l, i) => ({ time: i * 4, text: l }));
          }
        }
      }
    }
  } catch (e) {}
  return null;
}

app.get(
  "/api/lyrics/:id",
  requireReady,
  wrap(async (req, res) => {
    try {
      const videoId = req.params.id;
      const title = (req.query.title || "").trim();
      const artist = (req.query.artist || "").trim();

      if (title) {
        try {
          const synced = await cached(`synced:${title}:${artist}`, () => withTimeout(getSyncedLyrics(title, artist), 3500));
          if (synced && synced.length) {
            return res.json({ synced: true, lines: synced });
          }
        } catch (e) {}
      }

      if (videoId && videoId !== "unknown") {
        try {
          const lyrics = await cached(`lyrics:${videoId}`, () => withTimeout(ytmusic.getLyrics(videoId), 3500));
          if (Array.isArray(lyrics) && lyrics.length) {
            const plainLines = lyrics.map((text) => (typeof text === "string" ? text : text.text || ""));
            return res.json({ synced: false, lines: plainLines });
          }
        } catch (e) {}
      }

      res.json({ synced: false, lines: [] });
    } catch (err) {
      res.status(200).json({ synced: false, lines: [] });
    }
  })
);

app.get(
  "/api/stream/:id",
  wrap(async (req, res) => {
    const videoId = req.params.id;
    if (!videoId || videoId === "unknown") {
      return res.status(400).send("Invalid video ID");
    }

    try {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Accept-Ranges", "bytes");

      const stream = ytdl(videoId, {
        filter: "audioonly",
        highWaterMark: 1 << 25
      });

      stream.on("error", (err) => {
        console.warn("YTDL Stream error:", err.message);
        if (!res.headersSent) {
          res.status(500).send("Stream error");
        }
      });

      stream.pipe(res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).send(err.message);
      }
    }
  })
);

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

app.get(
  "/api/suggestions",
  requireReady,
  wrap(async (req, res) => {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const suggestions = await cached(`sugg:${q}`, () => ytmusic.getSearchSuggestions(q));
    res.json(suggestions || []);
  })
);

app.get(
  "/api/search",
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

app.get(
  "/api/global-mix",
  wrap(async (req, res) => {
    const cacheKey = "global:mix:all";
    const hit = cacheGet(cacheKey);
    if (hit !== undefined) return res.json(hit);

    // Return instant pre-cached response in 0ms while refreshing cache asynchronously in background
    res.json(INSTANT_GLOBAL_HITS);

    // Background fetch to update cache for future requests
    (async () => {
      try {
        if (!ready) return;
        const queries = ["Global Top Hits", "Bollywood Top Hits", "Punjabi Hits", "Billboard Top Songs"];
        const results = await Promise.allSettled(queries.map(q => ytmusic.searchSongs(q)));
        let combined = [];
        results.forEach((r) => {
          if (r.status === "fulfilled" && Array.isArray(r.value)) {
            combined = combined.concat(r.value.slice(0, 6).map(mapSong));
          }
        });
        if (combined.length) {
          cacheSet(cacheKey, combined);
        }
      } catch (e) {}
    })();
  })
);

app.get(
  "/api/song/:id",
  requireReady,
  wrap(async (req, res) => {
    const song = await cached(`song:${req.params.id}`, () => ytmusic.getSong(req.params.id));
    res.json(song);
  })
);

app.get(
  "/api/lyrics/:id",
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

app.get(
  "/api/upnext/:id",
  requireReady,
  wrap(async (req, res) => {
    const upNext = await ytmusic.getUpNexts(req.params.id);
    res.json(upNext || []);
  })
);

app.get(
  "/api/artist/:id",
  requireReady,
  wrap(async (req, res) => {
    const artist = await cached(`artist:${req.params.id}`, () => ytmusic.getArtist(req.params.id));
    res.json(artist);
  })
);

app.get(
  "/api/album/:id",
  requireReady,
  wrap(async (req, res) => {
    const album = await cached(`album:${req.params.id}`, () => ytmusic.getAlbum(req.params.id));
    res.json(album);
  })
);

app.get(
  "/api/playlist/:id",
  requireReady,
  wrap(async (req, res) => {
    const playlist = await cached(`playlist:${req.params.id}`, () => ytmusic.getPlaylist(req.params.id));
    res.json(playlist);
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ready, cacheSize: cache.size });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Something went wrong" });
});

let activeServer;

function startServer(port, attemptsLeft = 5) {
  const server = app.listen(port, () => {
    console.log(`Sonora backend running on http://localhost:${port}`);
  });
  activeServer = server;

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      try { server.close(); } catch (e) {}
      if (attemptsLeft <= 0) {
        console.error(`Port ${port} is in use and no free port was found nearby.`);
        console.error(`Free it up with: netstat -ano | findstr :${port}  then  taskkill /PID <pid> /F`);
        process.exit(1);
      }
      console.warn(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1, attemptsLeft - 1);
    } else {
      throw err;
    }
  });
}

if (require.main === module) {
  startServer(PORT);
}

process.on("SIGTERM", () => activeServer?.close(() => process.exit(0)));
process.on("SIGINT", () => activeServer?.close(() => process.exit(0)));

module.exports = app;