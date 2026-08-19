const path = require("path");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
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
const blockedIPs = new Set();

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

    if (blockedIPs.has(ip) && !req.path.startsWith('/admin') && !req.path.startsWith('/api/admin')) {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Restricted — Sonora</title>
          <style>
            body { background: #07080a; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
            .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 40px 28px; border-radius: 24px; max-width: 420px; backdrop-filter: blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
            .icon { font-size: 48px; margin-bottom: 16px; }
            h1 { color: #e05d38; font-size: 22px; font-weight: 800; margin-bottom: 10px; }
            p { color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.6; margin: 0; }
            .ip-code { font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 6px; color: #60a5fa; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">⛔</div>
            <h1>Access Restricted</h1>
            <p>Your IP address (<span class="ip-code">${ip}</span>) has been blocked by Sonora Administration.</p>
          </div>
        </body>
        </html>
      `);
    }
  } catch (e) { }
  next();
});

app.use((req, res, next) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');
    const userAgent = req.headers['user-agent'] || '';

    if (ip && !req.path.startsWith('/admin') && !req.path.startsWith('/api/admin')) {
      const parsed = parseBrowser(userAgent);
      const existing = activeSessions.get(ip) || { resetSignal: false, lastResetExecuted: 0 };
      activeSessions.set(ip, {
        ip,
        browser: parsed.browser,
        os: parsed.os,
        userAgent,
        lastActive: Date.now(),
        resetSignal: existing.resetSignal || false,
        lastResetExecuted: existing.lastResetExecuted || 0
      });
    }
  } catch (e) { }
  next();
});

const ADMIN_PASSWORD_HASH = "5f3fc8eadb4e80553b8d14ffdce588037993cdf081be2c31c7923e23445c0623";

function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  const inputHash = crypto.createHash("sha256").update(inputPassword.trim()).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(ADMIN_PASSWORD_HASH));
  } catch (e) {
    return false;
  }
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (verifyAdminPassword(password)) {
    return res.json({ success: true, token: 'admin_auth_granted' });
  }
  res.status(401).json({ success: false, error: 'Incorrect admin password' });
});

app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});

app.get('/api/admin/sessions', (req, res) => {
  const sessions = Array.from(activeSessions.values()).map(s => ({
    ...s,
    isBlocked: blockedIPs.has(s.ip)
  })).sort((a, b) => b.lastActive - a.lastActive);

  res.json({
    total: sessions.length,
    blockedTotal: blockedIPs.size,
    sessions
  });
});

app.post('/api/admin/toggle-block', (req, res) => {
  const { ip } = req.body || {};
  if (!ip) return res.status(400).json({ error: 'IP required' });

  if (blockedIPs.has(ip)) {
    blockedIPs.delete(ip);
    return res.json({ success: true, isBlocked: false, message: `IP ${ip} has been unblocked` });
  } else {
    blockedIPs.add(ip);
    return res.json({ success: true, isBlocked: true, message: `IP ${ip} has been blocked` });
  }
});

let globalResetSignal = null;

app.post('/api/admin/reset-cache', (req, res) => {
  const { ip, all } = req.body || {};
  const resetId = 'reset_' + Date.now();

  // Clear in-memory server cache
  try {
    cache.clear();
  } catch (e) {}

  if (all) {
    globalResetSignal = resetId;
    for (const [, s] of activeSessions) {
      s.resetSignal = resetId;
    }
    return res.json({ success: true, message: 'Server cache purged and reset signal broadcast to all user sessions' });
  }

  if (ip && activeSessions.has(ip)) {
    const session = activeSessions.get(ip);
    session.resetSignal = resetId;
    return res.json({ success: true, message: `Server cache purged and reset signal sent to IP ${ip}` });
  }

  res.status(400).json({ error: 'Session IP not found' });
});

app.get('/api/check-reset', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');
  const session = activeSessions.get(ip);

  const resetId = (session && session.resetSignal) || globalResetSignal;
  if (resetId) {
    return res.json({ reset: true, resetId });
  }
  res.json({ reset: false });
});

app.post('/api/confirm-reset', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim().replace(/^::ffff:/, '');
  const session = activeSessions.get(ip);

  if (session) {
    session.resetSignal = false;
    session.lastResetExecuted = Date.now();
  }
  res.json({ success: true });
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

function bestThumb(thumbs) {
  if (!Array.isArray(thumbs) || !thumbs.length) return "";
  return thumbs[thumbs.length - 1]?.url || thumbs[0]?.url || "";
}

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
  // Strict rejection if title similarity is too low (prevents completely wrong songs)
  if (tSim < 0.62) return 0;

  let score = tSim * 50;

  // Exact normalized title match bonus
  if (normalizeLyricsQueryString(item.trackName) === normalizeLyricsQueryString(targetTitle)) {
    score += 20;
  }

  // Artist scoring
  if (targetArtist && item.artistName) {
    const aSim = calculateStringSimilarity(item.artistName, targetArtist);
    if (aSim >= 0.70) {
      score += 25;
    } else if (aSim < 0.25) {
      score -= 25; // Penalty for wrong artist
    }
  }

  // Duration proximity scoring
  if (targetDuration > 0 && item.duration) {
    const diff = Math.abs(item.duration - targetDuration);
    if (diff <= 4) {
      score += 20;
    } else if (diff <= 10) {
      score += 10;
    } else if (diff > 25) {
      score -= 30; // Heavy penalty for big duration mismatch (different song or cut)
    }
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

    // 1. Direct GET endpoint if exact artist & title available
    if (cleanTitle && primaryArtist) {
      try {
        let getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(primaryArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        if (targetDuration > 0) {
          getUrl += `&duration=${Math.round(targetDuration)}`;
        }
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

    // 2. Multi-Query Search with Candidate Scoring
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
          if (score >= 65) {
            candidates.push({ item, score });
          }
        }

        if (candidates.length > 0 && candidates.some(c => c.score >= 85)) {
          break;
        }
      } catch (e) { }
    }

    if (candidates.length > 0) {
      // Sort highest score first
      candidates.sort((a, b) => b.score - a.score);

      // Prioritize highest scoring synced candidate
      const bestSynced = candidates.find(c => c.item.syncedLyrics && c.score >= 65);
      if (bestSynced) {
        const parsed = parseLrc(bestSynced.item.syncedLyrics);
        if (parsed.length) return { synced: true, lines: parsed };
      }

      // Fallback to highest scoring plain candidate
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

app.get(
  "/api/lyrics/:id",
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
        filter: format => format.hasAudio,
        quality: "highestaudio",
        highWaterMark: 1 << 25
      });

      stream.on("error", (err) => {
        if (!res.headersSent) {
          res.status(404).send("Audio stream unavailable");
        }
      });

      stream.pipe(res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(404).send("Stream format unavailable");
      }
    }
  })
);

app.get(
  "/api/stream-url/:id",
  wrap(async (req, res) => {
    const videoId = req.params.id;
    if (!videoId || videoId === "unknown") {
      return res.status(400).json({ error: "Invalid video ID" });
    }

    try {
      const info = await ytdl.getInfo(videoId);
      if (info && Array.isArray(info.formats)) {
        const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
        if (audioFormats && audioFormats.length && audioFormats[0].url) {
          return res.json({ url: audioFormats[0].url });
        }
        const anyAudio = info.formats.find(f => f.hasAudio && f.url);
        if (anyAudio && anyAudio.url) {
          return res.json({ url: anyAudio.url });
        }
      }
      res.status(404).json({ error: "No direct audio format found" });
    } catch (err) {
      res.status(404).json({ error: "Unable to resolve direct stream" });
    }
  })
);

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

  // If title is formatted as "Artist - Track"
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
      let hit = cacheGet(cacheKey);
      if (hit === undefined) {
        hit = (await ytmusic.searchAlbums(q)).slice(0, 20).map(mapAlbum);
        cacheSet(cacheKey, hit);
      }
      payload = hit;
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

      // If albums are sparse, extract from matched songs or search by artist
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

        if (albums.length < 3) {
          try {
            const artistQuery = songs[0]?.artist || q;
            const extraAlbums = await ytmusic.searchAlbums(artistQuery);
            if (Array.isArray(extraAlbums)) {
              extraAlbums.slice(0, 6).forEach(al => {
                const mapped = mapAlbum(al);
                if (!seenAlbums.has((mapped.name || '').toLowerCase())) {
                  seenAlbums.add((mapped.name || '').toLowerCase());
                  albums.push(mapped);
                }
              });
            }
          } catch (e) { }
        }
      }

      // If playlists are sparse, search for matching playlist mixes
      if (playlists.length < 3 && songs.length > 0) {
        try {
          const plQuery = `${q} playlist`;
          const extraPl = await ytmusic.searchPlaylists(plQuery);
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
  { videoId: "fJ9rUzIMcZQ", name: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: 354, thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
  { videoId: "fKopy74weus", name: "Thunder", artist: "Imagine Dragons", album: "Evolve", duration: 187, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" },
  { videoId: "JGwWNGJdvx8", name: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", duration: 233, thumbnail: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80" },
  { videoId: "k2qgadSvNyU", name: "New Rules", artist: "Dua Lipa", album: "Dua Lipa", duration: 209, thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80" },
  { videoId: "3tmd-ClpJxA", name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: 200, thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
  { videoId: "ru0K8uYEZWw", name: "Can't Stop the Feeling!", artist: "Justin Timberlake", album: "Trolls", duration: 236, thumbnail: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" },
  { videoId: "nYh-n7EOtMA", name: "Cheap Thrills", artist: "Sia", album: "This Is Acting", duration: 211, thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" },
  { videoId: "0VwhorTQigY", name: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: 174, thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
  { videoId: "nfWlot6h_JM", name: "Shake It Off", artist: "Taylor Swift", album: "1989", duration: 219, thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80" },
  { videoId: "vRXZj0DzXIA", name: "Castle on the Hill", artist: "Ed Sheeran", album: "÷ (Divide)", duration: 261, thumbnail: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80" },
  { videoId: "RgKAFK5djSk", name: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", album: "Furious 7", duration: 229, thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80" }
];

function shuffleServerArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

app.get(
  "/api/global-mix",
  wrap(async (req, res) => {
    const cacheKey = "global:mix:all";
    const hit = cacheGet(cacheKey);
    if (hit !== undefined && Array.isArray(hit) && hit.length) {
      return res.json(shuffleServerArray(hit));
    }

    res.json(shuffleServerArray(INSTANT_GLOBAL_HITS));

    (async () => {
      try {
        if (!ready) return;
        const queries = [
          "Global Top Hits",
          "Acoustic Pop Hits",
          "Indie Chill Tracks",
          "Billboard Top Songs",
          "Bollywood Top Hits",
          "Lo-Fi Beats"
        ];
        const results = await Promise.allSettled(queries.map(q => ytmusic.searchSongs(q)));
        let combined = [];
        results.forEach((r) => {
          if (r.status === "fulfilled" && Array.isArray(r.value)) {
            combined = combined.concat(r.value.slice(0, 8).map(mapSong));
          }
        });
        if (combined.length) {
          cacheSet(cacheKey, combined);
        }
      } catch (e) { }
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
  "/api/upnext/:id",
  requireReady,
  wrap(async (req, res) => {
    const upNext = await ytmusic.getUpNexts(req.params.id);
    if (Array.isArray(upNext)) {
      return res.json(upNext.map(mapSong).filter(Boolean));
    }
    res.json([]);
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
      try { server.close(); } catch (e) { }
      if (attemptsLeft <= 0) {
        console.error(`Port ${port} is in use and no free port was found nearby.`);
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