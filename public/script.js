'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const app = $('app');
const sidebar = $('sidebar');
const brandLogoBtn = $('brandLogoBtn');

const navItems = Array.from($$('.nav-item'));
const viewPanels = Array.from($$('.view-panel'));

const navBackBtn = $('navBackBtn');
const navForwardBtn = $('navForwardBtn');

const quickSearchBtn = $('quickSearchBtn');
const topSearchWrap = $('topSearchWrap');
const searchInput = $('searchInput');
const clearSearchBtn = $('clearSearchBtn');
const topSuggestionsDropdown = $('topSuggestionsDropdown');
const discoverBtn = $('discoverBtn');

const pageSearchInput = $('pageSearchInput');
const pageClearSearchBtn = $('pageClearSearchBtn');
const pageSuggestionsDropdown = $('pageSuggestionsDropdown');
const searchFilterPills = $('searchFilterPills');

const searchBrowseState = $('searchBrowseState');
const searchResultsWrapper = $('searchResultsWrapper');
const searchResultsStatus = $('searchResultsStatus');
const topResultContainer = $('topResultContainer');
const topResultCard = $('topResultCard');

const searchSongsBlock = $('searchSongsBlock');
const searchResultsList = $('searchResultsList');
const songsCountBadge = $('songsCountBadge');

const searchArtistsBlock = $('searchArtistsBlock');
const searchArtistsGrid = $('searchArtistsGrid');

const searchAlbumsBlock = $('searchAlbumsBlock');
const searchAlbumsGrid = $('searchAlbumsGrid');

const searchPlaylistsBlock = $('searchPlaylistsBlock');
const searchPlaylistsGrid = $('searchPlaylistsGrid');

const searchDetailView = $('searchDetailView');
const backToSearchBtn = $('backToSearchBtn');
const detailHeader = $('detailHeader');
const detailPlayAllBtn = $('detailPlayAllBtn');
const detailTrackList = $('detailTrackList');

const playerBar = $('playerBar');
const playerThumb = $('playerThumb');
const playerTitle = $('playerTitle');
const playerArtist = $('playerArtist');
const playerLikeBtn = $('playerLikeBtn');

const playBtn = $('playBtn');
const playBtnIcon = $('playBtnIcon');
const prevBtn = $('prevBtn');
const nextBtn = $('nextBtn');
const shuffleBtn = $('shuffleBtn');
const repeatBtn = $('repeatBtn');

const seekInput = $('seekInput');
const progressFill = $('progressFill');
const progressThumb = $('progressThumb');
const curTimeEl = $('curTime');
const durTimeEl = $('durTime');

const muteBtn = $('muteBtn');
const volIcon = $('volIcon');
const volInput = $('volInput');
const volFill = $('volFill');
const volThumb = $('volThumb');

const lyricsToggleBtn = $('lyricsToggleBtn');
const lyricsDrawer = $('lyricsDrawer');
const closeLyricsBtn = $('closeLyricsBtn');
const lyricsSongTitle = $('lyricsSongTitle');
const lyricsSongArtist = $('lyricsSongArtist');
const lyricsContent = $('lyricsContent');

const expandBtn = $('expandBtn');
const fullscreenPlayer = $('fullscreenPlayer');
const closeFullscreenBtn = $('closeFullscreenBtn');
const fsBackdropBlur = $('fsBackdropBlur');
const fsHeaderAlbum = $('fsHeaderAlbum');
const fsAlbumArt = $('fsAlbumArt');
const fsTrackTitle = $('fsTrackTitle');
const fsTrackArtist = $('fsTrackArtist');
const fsLikeBtn = $('fsLikeBtn');
const fsLyricsBtn = $('fsLyricsBtn');
const fsLyricsContent = $('fsLyricsContent');

const fsPlayBtn = $('fsPlayBtn');
const fsPlayBtnIcon = $('fsPlayBtnIcon');
const fsPrevBtn = $('fsPrevBtn');
const fsNextBtn = $('fsNextBtn');
const fsShuffleBtn = $('fsShuffleBtn');
const fsRepeatBtn = $('fsRepeatBtn');

const fsSeekInput = $('fsSeekInput');
const fsProgressFill = $('fsProgressFill');
const fsProgressThumb = $('fsProgressThumb');
const fsCurTime = $('fsCurTime');
const fsDurTime = $('fsDurTime');

const newPlaylistBtn = $('newPlaylistBtn');
const makeRoomCard = $('makeRoomCard');
const createPlaylistModal = $('createPlaylistModal');
const newPlaylistNameInput = $('newPlaylistNameInput');
const newPlaylistDescInput = $('newPlaylistDescInput');
const cancelPlaylistBtn = $('cancelPlaylistBtn');
const confirmPlaylistBtn = $('confirmPlaylistBtn');

const playlistsGrid = $('playlistsGrid');
const libraryTrackList = $('libraryTrackList');
const likedSongsList = $('likedSongsList');
const toast = $('toast');

const homeEasyModeBtn = $('homeEasyModeBtn');
const easyModeOverlay = $('easyModeOverlay');
const easyBgArt = $('easyBgArt');
const easyTrackThumb = $('easyTrackThumb');
const easyTrackTitle = $('easyTrackTitle');
const easyTrackArtist = $('easyTrackArtist');
const easyCurTime = $('easyCurTime');
const easyDurTime = $('easyDurTime');
const easyProgressFill = $('easyProgressFill');
const easySeekInput = $('easySeekInput');
const easyPlayBtn = $('easyPlayBtn');
const easyPlayIcon = $('easyPlayIcon');
const easyPrevBtn = $('easyPrevBtn');
const easyNextBtn = $('easyNextBtn');
const easyRepeatBtn = $('easyRepeatBtn');
const easyLikeBtn = $('easyLikeBtn');
const easyLikeIcon = $('easyLikeIcon');
const easySearchBtn = $('easySearchBtn');
const easyExitBtn = $('easyExitBtn');
const easySearchModal = $('easySearchModal');
const easySearchInput = $('easySearchInput');
const easySearchCloseBtn = $('easySearchCloseBtn');
const easySearchResults = $('easySearchResults');

const API_BASE = '';
const PLAY_SVG = '<path d="M8 5v14l11-7z"/>';
const PAUSE_SVG = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
const HEART_FILLED = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#E05D38" stroke="#E05D38" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
const HEART_OUTLINE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80';

const DEFAULT_SONG = {
  videoId: 'dQw4w9WgXcQ',
  name: 'Still Water',
  artist: 'Mara Vale · Tide Lines',
  album: 'Tide Lines',
  thumbnail: FALLBACK_THUMB,
  duration: 232
};

let ytPlayer = null;
let isPlayerReady = false;
let isPlaying = false;
let isDraggingSeek = false;
let isDraggingFsSeek = false;
let isDraggingEasySeek = false;
let currentPlaylist = [];
let currentTrackIndex = -1;
let currentTrack = null;
let isMuted = false;
let lastVolume = 80;
let isShuffle = false;
let isRepeat = false;
let isEasyMode = false;

let currentFilter = 'all';
let likedSongs = JSON.parse(localStorage.getItem('sonora_liked_songs') || '[]');
let customPlaylists = JSON.parse(localStorage.getItem('sonora_playlists') || '[]');
let userHistory = JSON.parse(localStorage.getItem('sonora_user_history') || '[]');
let recentSearches = JSON.parse(localStorage.getItem('sonora_recent_searches') || '[]');
let lastRecommendedTracks = [];
let viewStack = ['home'];
let allSearchSongs = [];
let searchOffset = 0;
let isLoadingMore = false;
let searchHasMore = false;
let currentSearchQuery = '';
let viewStackIndex = 0;

let activeSyncedLyrics = null;
let currentActiveLyricIndex = -1;
let activeLyricsRequestId = null;
let animationFrameId = null;
let lastRenderedTimeSec = -1;
let playbackFailoverTimer = null;

const bgAudioBridge = $('bgAudioBridge');
const SILENT_AUDIO_SRC = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ8AAACAgICAgICAgICAgIA=';

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  setupNavigation();
  setupHistoryNavigation();
  setupSearchEngine();
  setupPlayerControls();
  setupFullscreenPlayer();
  setupAllAppInteractions();
  setupLyricsDrawer();
  setupPlaylistsModal();
  setupMediaSession();
  setupEasyModeControls();
  setupRemoteCachePurgeListener();
  setupSearchInfiniteScroll();
  updateTimeTag();

  restoreLastSearch();
  renderLikedSongsView();
  renderCustomPlaylists();
  renderPersonalizedHomeFeed();
  renderRecentSearches();
  setTrackInfo(DEFAULT_SONG);
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    });
  }
}

function updateTimeTag() {
  const el = $('currentTimeTag');
  if (!el) return;
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  el.textContent = `${days[now.getDay()]} · ${hours}:${minutes} ${ampm}`;
}

function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
  });

  if (brandLogoBtn) {
    brandLogoBtn.addEventListener('click', () => switchView('home'));
  }

  const tabBtns = $$('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLibraryView(btn.dataset.tab);
    });
  });
}

function setupHistoryNavigation() {
  if (navBackBtn) {
    navBackBtn.addEventListener('click', () => {
      if (viewStackIndex > 0) {
        viewStackIndex--;
        switchView(viewStack[viewStackIndex], false);
      }
    });
  }

  if (navForwardBtn) {
    navForwardBtn.addEventListener('click', () => {
      if (viewStackIndex < viewStack.length - 1) {
        viewStackIndex++;
        switchView(viewStack[viewStackIndex], false);
      }
    });
  }
}

function switchView(viewName, pushToHistory = true) {
  if (pushToHistory && viewStack[viewStackIndex] !== viewName) {
    viewStack = viewStack.slice(0, viewStackIndex + 1);
    viewStack.push(viewName);
    viewStackIndex = viewStack.length - 1;
  }

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  const targetPanelId = `view${capitalize(viewName)}`;
  viewPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== targetPanelId);
  });

  if (viewName !== 'search' && topSearchWrap) {
    topSearchWrap.classList.add('hidden');
  }

  if (viewName === 'liked-songs') renderLikedSongsView();
  else if (viewName === 'library') renderLibraryView('songs');
  else if (viewName === 'playlists') renderCustomPlaylists();
  else if (viewName === 'made-for-you') initForYouFeed();
}

function capitalize(str) {
  if (!str) return '';
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin
    },
    events: {
      onReady: (event) => {
        isPlayerReady = true;
        event.target.setVolume(lastVolume);
        if (currentTrack && currentTrack.videoId) {
          ytPlayer.loadVideoById(currentTrack.videoId);
        }
      },
      onStateChange: onPlayerStateChange,
      onError: () => {
        if (currentTrack) attemptAudioFailover(currentTrack);
      }
    }
  });
};

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (playbackFailoverTimer) clearTimeout(playbackFailoverTimer);
    setPlayingState(true);
    startProgressTimer();
  } else if (event.data === YT.PlayerState.PAUSED) {
    setPlayingState(false);
    stopProgressTimer();
  } else if (event.data === YT.PlayerState.ENDED) {
    setPlayingState(false);
    stopProgressTimer();
    if (isRepeat && currentTrack) {
      if (ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(0);
        ytPlayer.playVideo();
      }
    } else {
      playNextTrack();
    }
  }
}

async function attemptAudioFailover(track) {
  if (!track) return;
  if (playbackFailoverTimer) clearTimeout(playbackFailoverTimer);
  const videoId = track.videoId;

  if (bgAudioBridge && videoId) {
    try {
      bgAudioBridge.src = `${API_BASE}/api/stream/${videoId}`;
      await bgAudioBridge.play();
      setPlayingState(true);
      startProgressTimer();
      return;
    } catch (e) { }

    try {
      const res = await fetch(`${API_BASE}/api/stream-url/${videoId}`);
      const data = await res.json();
      if (data && data.url) {
        bgAudioBridge.src = data.url;
        await bgAudioBridge.play();
        setPlayingState(true);
        startProgressTimer();
        return;
      }
    } catch (e) { }
  }

  if (!track._hasRetriedAlternative) {
    track._hasRetriedAlternative = true;
    const fallbackQuery = `${track.name || ''} ${track.artist || ''} audio`.trim();
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(fallbackQuery)}&type=songs`);
      const data = await res.json();
      const songs = Array.isArray(data) ? data : (data.songs || []);
      const altTrack = songs.find(s => s.videoId && s.videoId !== track.videoId);
      if (altTrack) {
        altTrack._hasRetriedAlternative = true;
        playTrack(altTrack, currentPlaylist);
        return;
      }
    } catch (err) { }
  }

  showToast('Track unavailable, skipping...');
  setTimeout(playNextTrack, 800);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (isPlaying) initBgAudioBridge();
  } else if (document.visibilityState === 'visible') {
    if (isPlaying && bgAudioBridge && !bgAudioBridge.paused && !bgAudioBridge.src.includes('data:audio')) {
      try {
        const bgTime = bgAudioBridge.currentTime || 0;
        if (ytPlayer && isPlayerReady && bgTime > 0) {
          ytPlayer.seekTo(bgTime, true);
          ytPlayer.playVideo();
        }
      } catch (e) { }
    }
  }
});

function initBgAudioBridge() {
  if (!bgAudioBridge) return;
  if (currentTrack && currentTrack.videoId) {
    const streamUrl = `${API_BASE}/api/stream/${currentTrack.videoId}`;
    if (!bgAudioBridge.src.includes(currentTrack.videoId)) {
      bgAudioBridge.src = streamUrl;
    }
    if (ytPlayer && isPlayerReady) {
      try {
        const curTime = ytPlayer.getCurrentTime() || 0;
        if (Math.abs(bgAudioBridge.currentTime - curTime) > 2) {
          bgAudioBridge.currentTime = curTime;
        }
      } catch (e) { }
    }
  } else if (!bgAudioBridge.src || bgAudioBridge.src !== SILENT_AUDIO_SRC) {
    bgAudioBridge.src = SILENT_AUDIO_SRC;
  }
  bgAudioBridge.play().catch(() => { });
}

function setPlayingState(playing) {
  isPlaying = playing;
  if (playBtnIcon) playBtnIcon.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
  if (fsPlayBtnIcon) fsPlayBtnIcon.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
  if (easyPlayIcon) easyPlayIcon.innerHTML = playing ? PAUSE_SVG : PLAY_SVG;
  if (fullscreenPlayer) fullscreenPlayer.classList.toggle('is-playing', playing);

  const playerEq = $('playerEqualizer');
  const fsEq = $('fsEqualizer');
  if (playerEq) playerEq.classList.toggle('is-playing', playing);
  if (fsEq) fsEq.classList.toggle('is-playing', playing);

  if (playing) {
    startProgressTimer();
  } else {
    stopProgressTimer();
    if (bgAudioBridge) bgAudioBridge.pause();
  }

  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  updateActiveRowVisuals();
}

function startProgressTimer() {
  stopProgressTimer();
  function loop() {
    updateProgress();
    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop);
    }
  }
  animationFrameId = requestAnimationFrame(loop);
}

function stopProgressTimer() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Fixed Real-Time Audio Tracker
function updateProgress() {
  let cur = 0;
  let dur = (currentTrack && currentTrack.duration) ? currentTrack.duration : 0;

  if (ytPlayer && isPlayerReady) {
    try {
      cur = ytPlayer.getCurrentTime() || 0;
      dur = ytPlayer.getDuration() || dur;
    } catch (e) { }
  } else if (bgAudioBridge && !bgAudioBridge.paused && !bgAudioBridge.src.includes('data:audio')) {
    cur = bgAudioBridge.currentTime || 0;
    dur = bgAudioBridge.duration || dur;
  }

  const pct = dur > 0 ? (cur / dur) * 100 : 0;
  const curInt = Math.floor(cur);

  if (curInt !== lastRenderedTimeSec) {
    lastRenderedTimeSec = curInt;
    const formattedCur = formatTime(cur);
    const formattedDur = formatTime(dur);

    if (curTimeEl) curTimeEl.textContent = formattedCur;
    if (durTimeEl) durTimeEl.textContent = formattedDur;
    if (fsCurTime) fsCurTime.textContent = formattedCur;
    if (fsDurTime) fsDurTime.textContent = formattedDur;
    if (easyCurTime) easyCurTime.textContent = formattedCur;
    if (easyDurTime) easyDurTime.textContent = formattedDur;
  }

  if (!isDraggingSeek) {
    if (seekInput) {
      seekInput.max = dur || 100;
      seekInput.value = cur;
    }
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressThumb) progressThumb.style.left = `${pct}%`;
  }

  if (!isDraggingFsSeek && fsSeekInput) {
    fsSeekInput.max = dur || 100;
    fsSeekInput.value = cur;
    if (fsProgressFill) fsProgressFill.style.width = `${pct}%`;
    if (fsProgressThumb) fsProgressThumb.style.left = `${pct}%`;
  }

  if (!isDraggingEasySeek && easySeekInput) {
    easySeekInput.max = dur || 100;
    easySeekInput.value = cur;
    if (easyProgressFill) easyProgressFill.style.width = `${pct}%`;
  }

  // Active sync pass
  syncFullscreenLyricsProgress(cur);
}

function formatTime(seconds) {
  if (!seconds || seconds === '0:00') return '0:00';
  if (typeof seconds === 'string' && seconds.includes(':')) return seconds;
  const sec = typeof seconds === 'string' ? parseInt(seconds, 10) : Number(seconds);
  if (isNaN(sec) || sec <= 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function playTrack(track, playlist = []) {
  if (!track) return;
  currentTrack = track;
  setTrackInfo(track);
  recordSongToHistory(track);

  if (playlist && playlist.length) {
    currentPlaylist = playlist;
    currentTrackIndex = playlist.findIndex(t => (t.videoId && t.videoId === track.videoId) || (t.name && t.name === track.name));
    if (currentTrackIndex === -1) currentTrackIndex = 0;
  }

  setPlayingState(true);
  if (playbackFailoverTimer) clearTimeout(playbackFailoverTimer);

  if (track.videoId) {
    if (isPlayerReady && ytPlayer) {
      try {
        ytPlayer.loadVideoById(track.videoId);
      } catch (e) {
        attemptAudioFailover(track);
      }
    } else {
      const checkTimer = setInterval(() => {
        if (isPlayerReady && ytPlayer) {
          clearInterval(checkTimer);
          try { ytPlayer.loadVideoById(track.videoId); } catch (e) { }
        }
      }, 100);
      setTimeout(() => clearInterval(checkTimer), 4000);
    }

    playbackFailoverTimer = setTimeout(() => {
      if (currentTrack && currentTrack.videoId === track.videoId && !isPlaying) {
        attemptAudioFailover(track);
      }
    }, 6000);
  } else if (track.query || track.name) {
    fetchAndPlaySearch(track.query || `${track.name} ${track.artist || ''}`);
  }

  updateActiveRowVisuals();

  if (lyricsDrawer && !lyricsDrawer.classList.contains('hidden')) {
    fetchAndRenderLyrics(track);
  }

  fetchAndRenderFullscreenLyrics(track);
}

function setTrackInfo(track) {
  if (playerTitle) playerTitle.textContent = track.name || 'Unknown Track';
  if (playerArtist) playerArtist.textContent = track.artist || 'Unknown Artist';
  if (playerThumb) playerThumb.src = safeThumb(track.thumbnail);

  const isLiked = isSongLiked(track.videoId || track.name);
  if (playerLikeBtn) {
    playerLikeBtn.classList.toggle('active', isLiked);
    playerLikeBtn.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
  }

  updateMediaSessionMetadata(track);
  syncFullscreenUI();
  updateEasyModeTrackInfo(track);
}

function updateActiveRowVisuals() {
  if (!currentTrack) {
    $$('.track-row').forEach(row => row.classList.remove('is-playing'));
    return;
  }

  const activeId = currentTrack.videoId;
  const activeName = (currentTrack.name || '').trim().toLowerCase();

  $$('.track-row').forEach(row => {
    const rowVideoId = row.dataset.videoid;
    const rowSongName = (row.dataset.song || '').trim().toLowerCase();
    const isThisPlaying = (activeId && rowVideoId === activeId) || (activeName && rowSongName === activeName);

    row.classList.toggle('is-playing', isThisPlaying);
    const numEl = row.querySelector('.track-num');
    if (numEl) {
      numEl.innerHTML = isThisPlaying ? `<span class="playing-orange-dot">•</span>` : (row.dataset.idx || numEl.dataset.originalIdx || '01');
    }
  });
}

function renderTrackRows(container, tracks, append = false) {
  if (!container || !Array.isArray(tracks)) return;
  const fragment = document.createDocumentFragment();
  const baseIdx = append ? container.querySelectorAll('.track-row').length : 0;

  tracks.forEach((t, i) => {
    const isCurPlaying = currentTrack && ((currentTrack.videoId && currentTrack.videoId === t.videoId) || (currentTrack.name === t.name));
    const num = (baseIdx + i + 1).toString().padStart(2, '0');
    const isLiked = isSongLiked(t.videoId || t.name);

    const row = document.createElement('div');
    row.className = `track-row ${isCurPlaying ? 'is-playing' : ''}`;
    row.dataset.videoid = t.videoId || '';
    row.dataset.song = t.name || '';
    row.dataset.idx = num;

    row.innerHTML = `
      <span class="track-num">${isCurPlaying ? '<span class="playing-orange-dot">•</span>' : num}</span>
      <img class="track-thumb" width="38" height="38" loading="lazy" src="${safeThumb(t.thumbnail)}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(t.name)}</span>
        <span class="track-artist">${escapeHtml(t.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(t.album || 'Single')}</span>
      <span class="track-time">${formatTime(t.duration || t.duration_seconds || t.length)}</span>
      <button class="like-heart-btn ${isLiked ? 'active' : ''}">${isLiked ? HEART_FILLED : HEART_OUTLINE}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(t);
        const heartBtn = row.querySelector('.like-heart-btn');
        const nowLiked = isSongLiked(t.videoId || t.name);
        heartBtn.classList.toggle('active', nowLiked);
        heartBtn.innerHTML = nowLiked ? HEART_FILLED : HEART_OUTLINE;
        return;
      }
      playTrack(t, tracks);
    });

    fragment.appendChild(row);
  });

  if (!append) {
    container.innerHTML = '';
  }
  container.appendChild(fragment);
}

function renderAlbumCards(container, tracks) {
  if (!container || !Array.isArray(tracks) || !tracks.length) return;
  const fragment = document.createDocumentFragment();

  tracks.forEach(t => {
    const isLiked = isSongLiked(t.videoId || t.name);
    const card = document.createElement('div');
    card.className = 'album-card-modern';
    card.innerHTML = `
      <div class="art-container">
        <img width="400" height="400" loading="lazy" src="${safeThumb(t.thumbnail)}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <div class="art-overlay">
          <button class="play-circle-bubble"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
        </div>
      </div>
      <div class="album-details-row">
        <div>
          <h3 class="album-heading">${escapeHtml(t.name)}</h3>
          <p class="album-sub">${escapeHtml(t.artist)}</p>
        </div>
        <button class="like-heart-btn ${isLiked ? 'active' : ''}">${isLiked ? HEART_FILLED : HEART_OUTLINE}</button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(t);
        const heartBtn = card.querySelector('.like-heart-btn');
        const nowLiked = isSongLiked(t.videoId || t.name);
        heartBtn.classList.toggle('active', nowLiked);
        heartBtn.innerHTML = nowLiked ? HEART_FILLED : HEART_OUTLINE;
        return;
      }
      playTrack(t, tracks);
    });

    fragment.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

// ══════════════════════════════════════════════════════════════════════════
// 🎵 PRECISION SCROLL & REAL-TIME LYRICS SYNC ENGINE (APPLE MUSIC STYLE)
// ══════════════════════════════════════════════════════════════════════════
let isUserScrollingLyrics = false;
let userLyricsScrollTimeout = null;

function setupLyricsInteraction() {
  if (!fsLyricsContent) return;
  const onUserScrollActivity = () => {
    isUserScrollingLyrics = true;
    if (userLyricsScrollTimeout) clearTimeout(userLyricsScrollTimeout);
    userLyricsScrollTimeout = setTimeout(() => {
      isUserScrollingLyrics = false;
      // Smoothly re-center the current active lyric when user finishes reading
      if (currentActiveLyricIndex >= 0 && fsLyricsContent && fsLyricsContent.children[currentActiveLyricIndex]) {
        try {
          fsLyricsContent.children[currentActiveLyricIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        } catch (e) {}
      }
    }, 3200);
  };

  fsLyricsContent.addEventListener('wheel', onUserScrollActivity, { passive: true });
  fsLyricsContent.addEventListener('touchmove', onUserScrollActivity, { passive: true });
  fsLyricsContent.addEventListener('pointerdown', onUserScrollActivity, { passive: true });
}

setupLyricsInteraction();

function syncFullscreenLyricsProgress(currentTime) {
  if (!activeSyncedLyrics || !activeSyncedLyrics.length || !fsLyricsContent) return;

  const curTime = Number(currentTime) || 0;
  let activeIdx = -1;

  for (let i = 0; i < activeSyncedLyrics.length; i++) {
    if (curTime >= (activeSyncedLyrics[i].time - 0.20)) {
      activeIdx = i;
    } else {
      break;
    }
  }

  if (activeIdx !== currentActiveLyricIndex && activeIdx >= 0) {
    currentActiveLyricIndex = activeIdx;
    const lines = fsLyricsContent.children;

    for (let idx = 0; idx < lines.length; idx++) {
      const lineEl = lines[idx];
      if (idx === activeIdx) {
        lineEl.classList.add('active');
        lineEl.classList.remove('passed');

        if (!isUserScrollingLyrics) {
          try {
            lineEl.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });
          } catch (e) {
            const containerTop = fsLyricsContent.getBoundingClientRect().top;
            const lineTop = lineEl.getBoundingClientRect().top;
            const relativeOffset = lineTop - containerTop;
            const targetScroll = fsLyricsContent.scrollTop + relativeOffset - (fsLyricsContent.clientHeight / 2) + (lineEl.clientHeight / 2);
            fsLyricsContent.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }
        }
      } else if (idx < activeIdx) {
        lineEl.classList.remove('active');
        lineEl.classList.add('passed');
      } else {
        lineEl.classList.remove('active');
        lineEl.classList.remove('passed');
      }
    }
  }
}

async function fetchAndRenderFullscreenLyrics(track) {
  if (!fsLyricsContent) return;
  if (!track || (!track.videoId && !track.name)) {
    fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics unavailable for this track.</p>';
    activeSyncedLyrics = null;
    currentActiveLyricIndex = -1;
    return;
  }

  const trackId = track.videoId || track.name;
  activeLyricsRequestId = trackId;
  fsLyricsContent.innerHTML = '<p class="lyrics-placeholder lyrics-loading-pulse">Fetching synchronized lyrics...</p>';
  activeSyncedLyrics = null;
  currentActiveLyricIndex = -1;

  try {
    const title = track.name || '';
    const artist = track.artist || '';
    const duration = track.duration || 0;
    const res = await fetch(`${API_BASE}/api/lyrics/${track.videoId || 'unknown'}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&duration=${duration}`);
    const data = await res.json();

    if (activeLyricsRequestId !== trackId) return;

    if (data.synced && Array.isArray(data.lines) && data.lines.length) {
      activeSyncedLyrics = data.lines;
      const frag = document.createDocumentFragment();

      data.lines.forEach((lineObj, idx) => {
        const p = document.createElement('p');
        p.className = 'fs-lyrics-line';
        p.dataset.time = lineObj.time;
        p.dataset.index = idx;
        p.style.setProperty('--line-idx', Math.min(idx, 28));
        p.textContent = lineObj.text;

        p.addEventListener('click', () => {
          const seekTarget = parseFloat(lineObj.time);
          if (ytPlayer && isPlayerReady) {
            ytPlayer.seekTo(seekTarget, true);
          }
          if (bgAudioBridge && !bgAudioBridge.paused) {
            bgAudioBridge.currentTime = seekTarget;
          }
          isUserScrollingLyrics = false;
          syncFullscreenLyricsProgress(seekTarget);
        });
        frag.appendChild(p);
      });

      fsLyricsContent.innerHTML = '';
      fsLyricsContent.appendChild(frag);

      let cur = 0;
      if (ytPlayer && isPlayerReady) cur = ytPlayer.getCurrentTime();
      else if (bgAudioBridge && !bgAudioBridge.paused) cur = bgAudioBridge.currentTime;
      syncFullscreenLyricsProgress(cur || 0);

    } else if (Array.isArray(data.lines) && data.lines.length) {
      activeSyncedLyrics = null;
      const frag = document.createDocumentFragment();
      data.lines.forEach((line, idx) => {
        const p = document.createElement('p');
        p.className = 'fs-lyrics-line static-lyric';
        p.style.setProperty('--line-idx', Math.min(idx, 28));
        p.textContent = typeof line === 'string' ? line : (line.text || '');
        frag.appendChild(p);
      });
      fsLyricsContent.innerHTML = '';
      fsLyricsContent.appendChild(frag);
    } else {
      fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics not available for this song.</p>';
    }
  } catch (e) {
    if (activeLyricsRequestId === trackId) {
      fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Unable to load lyrics at this time.</p>';
    }
  }
}

function setupPlayerControls() {
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!ytPlayer || !isPlayerReady) return;
      const state = ytPlayer.getPlayerState();
      state === YT.PlayerState.PLAYING ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', playPrevTrack);
  if (nextBtn) nextBtn.addEventListener('click', playNextTrack);

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle('active', isShuffle);
      if (fsShuffleBtn) fsShuffleBtn.classList.toggle('active', isShuffle);
      showToast(isShuffle ? 'Shuffle on' : 'Shuffle off');
    });
  }

  if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle('active', isRepeat);
      if (fsRepeatBtn) fsRepeatBtn.classList.toggle('active', isRepeat);
      showToast(isRepeat ? 'Repeat on' : 'Repeat off');
    });
  }

  if (playerLikeBtn) {
    playerLikeBtn.addEventListener('click', () => {
      if (currentTrack) toggleLikeSong(currentTrack);
    });
  }

  if (seekInput) {
    seekInput.addEventListener('mousedown', () => { isDraggingSeek = true; });
    seekInput.addEventListener('touchstart', () => { isDraggingSeek = true; }, { passive: true });
    seekInput.addEventListener('input', () => {
      const val = parseFloat(seekInput.value);
      const max = parseFloat(seekInput.max) || 100;
      const pct = (val / max) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressThumb) progressThumb.style.left = `${pct}%`;
      if (curTimeEl) curTimeEl.textContent = formatTime(val);
    });
    seekInput.addEventListener('change', () => {
      isDraggingSeek = false;
      if (ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(parseFloat(seekInput.value), true);
      }
    });
  }

  if (volInput) {
    volInput.addEventListener('input', () => setVolume(parseInt(volInput.value, 10)));
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (ytPlayer && isPlayerReady) {
        isMuted ? ytPlayer.mute() : ytPlayer.unMute();
      }
      setVolume(isMuted ? 0 : lastVolume);
    });
  }
}

function setVolume(v) {
  lastVolume = v > 0 ? v : lastVolume;
  if (volFill) volFill.style.width = `${v}%`;
  if (volThumb) volThumb.style.left = `${v}%`;
  if (volInput) volInput.value = v;
  if (ytPlayer && isPlayerReady) ytPlayer.setVolume(v);
}

async function playNextTrack() {
  if (!currentPlaylist || !currentPlaylist.length) {
    if (lastRecommendedTracks && lastRecommendedTracks.length) {
      currentPlaylist = [...lastRecommendedTracks];
    } else if (userHistory && userHistory.length) {
      currentPlaylist = [...userHistory];
    }
  }

  if (!currentPlaylist || !currentPlaylist.length) return;

  const oldIndex = currentTrackIndex;
  let nextIndex = oldIndex + 1;

  if (isShuffle && currentPlaylist.length > 1) {
    let attempts = 0;
    do {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
      attempts++;
    } while (nextIndex === oldIndex && attempts < 20);
  }

  // Only fetch Up Next when reaching the end of the current playlist
  if (nextIndex >= currentPlaylist.length) {
    let addedNewTracks = false;

    if (currentTrack && currentTrack.videoId) {
      try {
        const res = await fetch(`${API_BASE}/api/upnext/${currentTrack.videoId}`);
        const data = await res.json();
        const rawSongs = Array.isArray(data) ? data : (data.tracks || data.songs || []);

        if (rawSongs && rawSongs.length) {
          const existingKeys = new Set(
            currentPlaylist.map(t => (t.videoId || (t.name || '').toLowerCase()))
          );

          const uniqueSongs = rawSongs
            .map(s => ({
              videoId: s.videoId || (typeof s.id === 'object' ? s.id.videoId : s.id) || '',
              name: s.name || s.title || s.heading || 'Untitled Track',
              artist: s.artist?.name || s.artist || currentTrack.artist || 'Sonora',
              album: s.album?.name || s.album || 'Single',
              thumbnail: safeThumb(s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : null)),
              duration: s.duration || s.duration_seconds || s.length || 200
            }))
            .filter(s => {
              const key = s.videoId || (s.name || '').toLowerCase();
              if (!key || existingKeys.has(key)) return false;
              existingKeys.add(key);
              return true;
            });

          if (uniqueSongs.length) {
            currentPlaylist = currentPlaylist.concat(uniqueSongs);
            nextIndex = oldIndex + 1;
            addedNewTracks = true;
          }
        }
      } catch (e) { }
    }

    if (!addedNewTracks) {
      nextIndex = 0;
    }
  }

  if (nextIndex < 0 || nextIndex >= currentPlaylist.length) {
    nextIndex = 0;
  }

  currentTrackIndex = nextIndex;
  playTrack(currentPlaylist[currentTrackIndex], currentPlaylist);
}

function playPrevTrack() {
  if (!currentPlaylist || !currentPlaylist.length) return;
  let prevIdx = currentTrackIndex - 1;
  if (prevIdx < 0) prevIdx = currentPlaylist.length - 1;
  currentTrackIndex = prevIdx;
  playTrack(currentPlaylist[currentTrackIndex], currentPlaylist);
}

function openFullscreen() {
  if (fullscreenPlayer) {
    fullscreenPlayer.classList.remove('hidden');
    document.body.classList.add('fullscreen-open');
    syncFullscreenUI();
  }
}

function closeFullscreen() {
  if (fullscreenPlayer) {
    fullscreenPlayer.classList.add('hidden');
    document.body.classList.remove('fullscreen-open');
  }
}

function setupFullscreenPlayer() {
  if (expandBtn) expandBtn.addEventListener('click', openFullscreen);
  const playerLeft = document.querySelector('.player-left');
  if (playerLeft) {
    playerLeft.addEventListener('click', (e) => {
      if (!e.target.closest('.like-heart-btn')) openFullscreen();
    });
  }

  if (closeFullscreenBtn) closeFullscreenBtn.addEventListener('click', closeFullscreen);

  if (fsLyricsBtn) {
    fsLyricsBtn.addEventListener('click', () => {
      if (!fullscreenPlayer) return;
      const isLyricsActive = fullscreenPlayer.classList.toggle('lyrics-active');
      fsLyricsBtn.classList.toggle('active', isLyricsActive);

      const fsRightLyricsCol = $('fsRightLyricsCol');
      if (fsRightLyricsCol) fsRightLyricsCol.classList.toggle('hidden', !isLyricsActive);
      if (isLyricsActive && currentTrack) fetchAndRenderFullscreenLyrics(currentTrack);
    });
  }

  if (fsPlayBtn) {
    fsPlayBtn.addEventListener('click', () => {
      if (!ytPlayer || !isPlayerReady) return;
      const state = ytPlayer.getPlayerState();
      state === YT.PlayerState.PLAYING ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    });
  }

  if (fsPrevBtn) fsPrevBtn.addEventListener('click', playPrevTrack);
  if (fsNextBtn) fsNextBtn.addEventListener('click', playNextTrack);

  if (fsShuffleBtn) {
    fsShuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      if (shuffleBtn) shuffleBtn.classList.toggle('active', isShuffle);
      fsShuffleBtn.classList.toggle('active', isShuffle);
      showToast(isShuffle ? 'Shuffle on' : 'Shuffle off');
    });
  }

  if (fsRepeatBtn) {
    fsRepeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      if (repeatBtn) repeatBtn.classList.toggle('active', isRepeat);
      fsRepeatBtn.classList.toggle('active', isRepeat);
      showToast(isRepeat ? 'Repeat on' : 'Repeat off');
    });
  }

  if (fsLikeBtn) {
    fsLikeBtn.addEventListener('click', () => {
      if (currentTrack) toggleLikeSong(currentTrack);
    });
  }

  if (fsSeekInput) {
    fsSeekInput.addEventListener('mousedown', () => { isDraggingFsSeek = true; });
    fsSeekInput.addEventListener('touchstart', () => { isDraggingFsSeek = true; }, { passive: true });
    fsSeekInput.addEventListener('input', () => {
      const val = parseFloat(fsSeekInput.value);
      const max = parseFloat(fsSeekInput.max) || 100;
      const pct = (val / max) * 100;
      if (fsProgressFill) fsProgressFill.style.width = `${pct}%`;
      if (fsProgressThumb) fsProgressThumb.style.left = `${pct}%`;
      if (fsCurTime) fsCurTime.textContent = formatTime(val);
    });
    fsSeekInput.addEventListener('change', () => {
      isDraggingFsSeek = false;
      if (ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(parseFloat(fsSeekInput.value), true);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenPlayer && !fullscreenPlayer.classList.contains('hidden')) {
      closeFullscreen();
    }
  });
}

function syncFullscreenUI() {
  if (!currentTrack) return;
  if (fsTrackTitle) fsTrackTitle.textContent = currentTrack.name || 'Unknown Track';
  if (fsTrackArtist) fsTrackArtist.textContent = currentTrack.artist || 'Unknown Artist';
  if (fsHeaderAlbum) fsHeaderAlbum.textContent = currentTrack.album || 'Sonora Record';

  const thumbUrl = safeThumb(currentTrack.thumbnail);
  if (fsAlbumArt) fsAlbumArt.src = thumbUrl;
  if (fsBackdropBlur) fsBackdropBlur.style.backgroundImage = `url('${thumbUrl}')`;

  const isLiked = isSongLiked(currentTrack.videoId || currentTrack.name);
  if (fsLikeBtn) {
    fsLikeBtn.classList.toggle('active', isLiked);
    fsLikeBtn.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
  }

  if (fsShuffleBtn) fsShuffleBtn.classList.toggle('active', isShuffle);
  if (fsRepeatBtn) fsRepeatBtn.classList.toggle('active', isRepeat);
  if (fsPlayBtnIcon) fsPlayBtnIcon.innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
}

function setupSearchEngine() {
  if (quickSearchBtn) {
    quickSearchBtn.addEventListener('click', () => {
      if (topSearchWrap) {
        topSearchWrap.classList.toggle('hidden');
        if (!topSearchWrap.classList.contains('hidden') && searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  let searchDebounceTimer;
  let suggestionDebounceTimer;

  const handleInput = (val, isTopbar) => {
    const q = val.trim();
    if (isTopbar) {
      if (pageSearchInput) pageSearchInput.value = val;
      if (clearSearchBtn) clearSearchBtn.classList.toggle('hidden', !q);
    } else {
      if (searchInput) searchInput.value = val;
      if (pageClearSearchBtn) pageClearSearchBtn.classList.toggle('hidden', !q);
    }

    clearTimeout(suggestionDebounceTimer);
    if (q.length >= 2) {
      suggestionDebounceTimer = setTimeout(() => fetchSearchSuggestions(q, isTopbar), 180);
    } else {
      hideSuggestions();
    }

    clearTimeout(searchDebounceTimer);
    if (!q) {
      showSearchBrowseState();
    } else {
      searchDebounceTimer = setTimeout(() => executeSearch(q, currentFilter), 300);
    }
  };

  if (searchInput) searchInput.addEventListener('input', (e) => handleInput(e.target.value, true));
  if (pageSearchInput) pageSearchInput.addEventListener('input', (e) => handleInput(e.target.value, false));

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (pageSearchInput) pageSearchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      if (pageClearSearchBtn) pageClearSearchBtn.classList.add('hidden');
      showSearchBrowseState();
      hideSuggestions();
    });
  }

  if (pageClearSearchBtn) {
    pageClearSearchBtn.addEventListener('click', () => {
      if (pageSearchInput) pageSearchInput.value = '';
      if (searchInput) searchInput.value = '';
      pageClearSearchBtn.classList.add('hidden');
      if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
      showSearchBrowseState();
      hideSuggestions();
    });
  }

  if (searchFilterPills) {
    searchFilterPills.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        searchFilterPills.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        const q = (pageSearchInput ? pageSearchInput.value.trim() : '') || (searchInput ? searchInput.value.trim() : '');
        if (q) executeSearch(q, currentFilter);
      });
    });
  }

  if (backToSearchBtn) {
    backToSearchBtn.addEventListener('click', () => {
      if (searchDetailView) searchDetailView.classList.add('hidden');
      if (searchResultsWrapper) searchResultsWrapper.classList.remove('hidden');
    });
  }
}

async function fetchSearchSuggestions(query, isTopbar) {
  try {
    const res = await fetch(`${API_BASE}/api/suggestions?q=${encodeURIComponent(query)}`);
    const suggestions = await res.json();
    if (!Array.isArray(suggestions) || !suggestions.length) {
      hideSuggestions();
      return;
    }

    const dropdown = isTopbar ? topSuggestionsDropdown : pageSuggestionsDropdown;
    if (!dropdown) return;

    const frag = document.createDocumentFragment();
    suggestions.slice(0, 6).forEach(s => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${escapeHtml(s)}</span>
      `;
      item.addEventListener('click', () => {
        if (pageSearchInput) pageSearchInput.value = s;
        if (searchInput) searchInput.value = s;
        hideSuggestions();
        executeSearch(s, currentFilter);
      });
      frag.appendChild(item);
    });

    dropdown.innerHTML = '';
    dropdown.appendChild(frag);
    dropdown.classList.remove('hidden');
  } catch (e) {
    hideSuggestions();
  }
}

function hideSuggestions() {
  if (topSuggestionsDropdown) topSuggestionsDropdown.classList.add('hidden');
  if (pageSuggestionsDropdown) pageSuggestionsDropdown.classList.add('hidden');
}

function showSearchBrowseState() {
  if (searchBrowseState) searchBrowseState.classList.remove('hidden');
  if (searchResultsWrapper) searchResultsWrapper.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.add('hidden');
  renderSearchBrowseSuggestions();
  renderRecentSearches();
}

async function executeSearch(query, filter = 'all') {
  switchView('search', false);
  addRecentSearch(query);
  if (searchBrowseState) searchBrowseState.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.add('hidden');
  if (searchResultsWrapper) searchResultsWrapper.classList.remove('hidden');
  hideSuggestions();

  // Reset scroll position for new search
  const contentBody = $('contentBody');
  if (contentBody) contentBody.scrollTop = 0;

  if (searchResultsStatus) searchResultsStatus.textContent = `Searching for "${query}"...`;

  if (topResultContainer) topResultContainer.classList.add('hidden');
  if (searchSongsBlock) searchSongsBlock.classList.add('hidden');
  if (searchArtistsBlock) searchArtistsBlock.classList.add('hidden');
  if (searchAlbumsBlock) searchAlbumsBlock.classList.add('hidden');
  if (searchPlaylistsBlock) searchPlaylistsBlock.classList.add('hidden');
  removeLoadMoreIndicator();

  // Reset pagination state
  currentSearchQuery = query;
  allSearchSongs = [];
  searchOffset = 0;
  searchHasMore = false;
  isLoadingMore = false;

  try {
    const fetchType = (filter === 'songs' || filter === 'all') ? 'all' : filter;
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&type=${fetchType}&limit=20&offset=0`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Search request failed');

    if (filter === 'all' || filter === 'songs') {
      renderSearchAllResults(data, query);
      const allSongs = data.songs || (Array.isArray(data) ? data : []);
      if (allSongs.length) {
        allSearchSongs = allSongs;
        searchOffset = allSongs.length;
        searchHasMore = true;
        lastRecommendedTracks = allSongs.slice(0, 10);
        persistLastSearch(allSongs, query);
      }
      if (data.playlists && data.playlists.length) {
        try {
          localStorage.setItem('sonora_recommended_playlists', JSON.stringify(data.playlists));
          const homePlaylists = $('homePlaylistsGrid');
          const searchBrowsePlaylists = $('searchBrowsePlaylistsGrid');
          if (homePlaylists) renderPlaylistsCards(homePlaylists, data.playlists);
          if (searchBrowsePlaylists) renderPlaylistsCards(searchBrowsePlaylists, data.playlists);
        } catch (e) { }
      }
      const total = (data.songs ? data.songs.length : allSongs.length);
      if (searchResultsStatus) searchResultsStatus.textContent = `Results for "${query}" (${total} songs, ${(data.albums || []).length} albums, ${(data.playlists || []).length} playlists)`;
    } else if (filter === 'artists') {
      renderArtistsSection(data);
      if (searchResultsStatus) searchResultsStatus.textContent = `${data.length} artists found for "${query}"`;
    } else if (filter === 'albums') {
      renderAlbumsSection(data);
      if (searchResultsStatus) searchResultsStatus.textContent = `${data.length} albums found for "${query}"`;
    } else if (filter === 'playlists') {
      renderPlaylistsSection(data);
      if (searchResultsStatus) searchResultsStatus.textContent = `${data.length} playlists found for "${query}"`;
    }
  } catch (err) {
    if (searchResultsStatus) searchResultsStatus.textContent = `Results for "${query}"`;
  }
}

function persistLastSearch(songs, query) {
  try {
    const payload = { songs: songs.slice(0, 30), query, timestamp: Date.now() };
    localStorage.setItem('sonora_last_search', JSON.stringify(payload));
  } catch (e) { }
}

function restoreLastSearch() {
  try {
    const stored = JSON.parse(localStorage.getItem('sonora_last_search') || 'null');
    if (stored && Array.isArray(stored.songs) && stored.songs.length) {
      lastRecommendedTracks = stored.songs.slice(0, 10);
    }
  } catch (e) { }
}

function setupSearchInfiniteScroll() {
  const contentBody = $('contentBody');
  if (!contentBody) return;

  contentBody.addEventListener('scroll', () => {
    if (!searchHasMore || isLoadingMore) return;
    if (!searchResultsWrapper || searchResultsWrapper.classList.contains('hidden')) return;
    if (!searchSongsBlock || searchSongsBlock.classList.contains('hidden')) return;

    const { scrollTop, scrollHeight, clientHeight } = contentBody;
    if (scrollTop + clientHeight >= scrollHeight - 350) {
      loadMoreSearchResults();
    }
  });
}

async function loadMoreSearchResults() {
  if (isLoadingMore || !searchHasMore || !currentSearchQuery) return;
  isLoadingMore = true;
  showLoadMoreIndicator('loading');

  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(currentSearchQuery)}&type=songs&limit=20&offset=${searchOffset}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Load more failed');

    const newSongs = data.songs || (Array.isArray(data) ? data : []);
    if (newSongs.length) {
      allSearchSongs = allSearchSongs.concat(newSongs);
      searchOffset += newSongs.length;
      searchHasMore = data.hasMore === true;
      appendSongsToList(newSongs);
      currentPlaylist = allSearchSongs;
      if (songsCountBadge) songsCountBadge.textContent = `${allSearchSongs.length} tracks`;

      persistLastSearch(allSearchSongs, currentSearchQuery);
      lastRecommendedTracks = allSearchSongs.slice(0, 10);
    } else {
      searchHasMore = false;
    }

    if (searchHasMore) {
      showLoadMoreIndicator();
    } else {
      removeLoadMoreIndicator();
    }
  } catch (err) {
    showLoadMoreIndicator();
  }
  isLoadingMore = false;
}

function appendSongsToList(songs) {
  if (!searchResultsList) return;
  const baseIdx = searchResultsList.querySelectorAll('.track-row').length;
  const frag = document.createDocumentFragment();

  songs.forEach((song, i) => {
    const idx = baseIdx + i;
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');
    const isLiked = isSongLiked(song.videoId);

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" loading="lazy" src="${safeThumb(song.thumbnail)}" alt="${escapeHtml(song.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(song.name)}</span>
        <span class="track-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(song.album || '')}</span>
      <span class="track-time">${formatTime(song.duration || song.duration_seconds || song.length)}</span>
      <button class="like-heart-btn ${isLiked ? 'active' : ''}">${isLiked ? HEART_FILLED : HEART_OUTLINE}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(song);
        const btn = row.querySelector('.like-heart-btn');
        const nowLiked = isSongLiked(song.videoId);
        btn.classList.toggle('active', nowLiked);
        btn.innerHTML = nowLiked ? HEART_FILLED : HEART_OUTLINE;
        return;
      }
      currentTrackIndex = idx;
      playTrack(song, allSearchSongs);
    });

    frag.appendChild(row);
  });

  searchResultsList.appendChild(frag);
}

function showLoadMoreIndicator(state) {
  let indicator = $('searchLoadMoreIndicator');
  if (!indicator && searchSongsBlock) {
    indicator = document.createElement('div');
    indicator.id = 'searchLoadMoreIndicator';
    indicator.className = 'search-load-more-indicator';
    searchSongsBlock.appendChild(indicator);
  }
  if (!indicator) return;
  if (state === 'loading') {
    indicator.innerHTML = '<div class="load-more-spinner"></div><span>Loading more tracks…</span>';
    indicator.classList.add('is-loading');
  } else {
    indicator.innerHTML = '<span>Scroll for more tracks</span>';
    indicator.classList.remove('is-loading');
  }
}

function removeLoadMoreIndicator() {
  const indicator = $('searchLoadMoreIndicator');
  if (indicator) indicator.remove();
}

function renderSearchAllResults(data, query) {
  const { topResult, songs = [], artists = [], albums = [], playlists = [] } = data;
  const totalCount = songs.length + artists.length + albums.length + playlists.length;
  if (!totalCount) {
    if (searchResultsStatus) searchResultsStatus.textContent = `No results found for "${query}".`;
    return;
  }

  if (searchResultsStatus) searchResultsStatus.textContent = `Results for "${query}"`;
  if (topResult) renderTopResultCard(topResult);
  if (songs.length) renderSongsSection(songs);
  if (artists.length) renderArtistsSection(artists);
  if (albums.length) renderAlbumsSection(albums);
  if (playlists.length) renderPlaylistsSection(playlists);
}

function renderTopResultCard(top) {
  if (!topResultContainer || !topResultCard) return;
  topResultContainer.classList.remove('hidden');
  const isArtist = top.type === 'artist' || top.artistId;
  const thumb = safeThumb(top.thumbnail);
  const typeText = top.type ? top.type.toUpperCase() : 'TOP RESULT';

  topResultCard.innerHTML = `
    <img class="top-result-thumb ${isArtist ? 'is-artist' : ''}" loading="lazy" src="${thumb}" alt="${escapeHtml(top.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
    <div class="top-result-info">
      <span class="top-result-type-badge">${typeText}</span>
      <h2 class="top-result-title">${escapeHtml(top.name)}</h2>
      <p class="top-result-subtitle">${escapeHtml(top.artist || top.type || 'Music')}</p>
    </div>
    <button class="top-result-play-btn" title="Play">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
    </button>
  `;

  topResultCard.onclick = () => {
    if (top.type === 'artist' && top.artistId) openArtistDetails(top.artistId, top.name, thumb);
    else if (top.type === 'album' && top.albumId) openAlbumDetails(top.albumId, top.name, top.artist, thumb);
    else playTrack(top);
  };
}

function renderSongsSection(songs) {
  if (!searchSongsBlock || !searchResultsList) return;
  searchSongsBlock.classList.remove('hidden');
  if (songsCountBadge) songsCountBadge.textContent = `${songs.length} tracks`;
  searchResultsList.innerHTML = '';
  currentPlaylist = songs;

  const frag = document.createDocumentFragment();
  songs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');
    const isLiked = isSongLiked(song.videoId);

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" loading="lazy" src="${safeThumb(song.thumbnail)}" alt="${escapeHtml(song.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(song.name)}</span>
        <span class="track-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(song.album || '')}</span>
      <span class="track-time">${formatTime(song.duration || song.duration_seconds || song.length)}</span>
      <button class="like-heart-btn ${isLiked ? 'active' : ''}">${isLiked ? HEART_FILLED : HEART_OUTLINE}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(song);
        const btn = row.querySelector('.like-heart-btn');
        const nowLiked = isSongLiked(song.videoId);
        btn.classList.toggle('active', nowLiked);
        btn.innerHTML = nowLiked ? HEART_FILLED : HEART_OUTLINE;
        return;
      }
      currentTrackIndex = idx;
      playTrack(song, songs);
    });

    frag.appendChild(row);
  });

  searchResultsList.appendChild(frag);
}

function renderArtistsSection(artists) {
  if (!searchArtistsBlock || !searchArtistsGrid) return;
  searchArtistsBlock.classList.remove('hidden');
  const frag = document.createDocumentFragment();

  artists.forEach(artist => {
    const card = document.createElement('div');
    card.className = 'artist-pill-btn';
    card.innerHTML = `
      <span class="artist-pill-name">${escapeHtml(artist.name)}</span>
      <span class="artist-badge-icon">&#x266A;</span>
    `;

    card.addEventListener('click', () => {
      if (artist.artistId) {
        openArtistDetails(artist.artistId, artist.name, artist.thumbnail || '');
      } else {
        executeSearch(artist.name, 'songs');
      }
    });

    frag.appendChild(card);
  });

  searchArtistsGrid.innerHTML = '';
  searchArtistsGrid.appendChild(frag);
}

function renderAlbumsSection(albums) {
  if (!searchAlbumsBlock || !searchAlbumsGrid) return;
  searchAlbumsBlock.classList.remove('hidden');
  const frag = document.createDocumentFragment();

  albums.forEach(album => {
    const card = document.createElement('div');
    card.className = 'album-card';
    const thumb = safeThumb(album.thumbnail);
    card.innerHTML = `
      <div class="album-art-wrap">
        <img class="album-cover-img" loading="lazy" src="${thumb}" alt="${escapeHtml(album.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <button class="album-play-overlay"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
      </div>
      <div class="album-meta">
        <div class="album-title-row">
          <span class="album-name">${escapeHtml(album.name)}</span>
        </div>
        <p class="album-artist">${escapeHtml(album.artist || 'Album')} ${album.year ? '· ' + album.year : ''}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (album.albumId) openAlbumDetails(album.albumId, album.name, album.artist, thumb);
      else executeSearch(`${album.name} ${album.artist || ''}`, 'songs');
    });

    frag.appendChild(card);
  });

  searchAlbumsGrid.innerHTML = '';
  searchAlbumsGrid.appendChild(frag);
}

const PLAYLIST_COVER_PALETTE = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=150&q=80"
];

function getPlaylist4Images(pl, fallbackIdx = 0) {
  const images = [];

  // 1. If playlist has tracks with thumbnails
  if (Array.isArray(pl.tracks) && pl.tracks.length) {
    pl.tracks.forEach(t => {
      const thumb = safeThumb(t.thumbnail);
      if (thumb && !images.includes(thumb) && images.length < 4) {
        images.push(thumb);
      }
    });
  }

  // 2. If playlist has explicit multiple thumbnails
  if (Array.isArray(pl.thumbnails) && pl.thumbnails.length >= 4) {
    pl.thumbnails.forEach(t => {
      const url = t?.url || t;
      if (url && !images.includes(url) && images.length < 4) {
        images.push(url);
      }
    });
  }

  // 3. Add primary thumbnail if available
  const mainThumb = safeThumb(pl.thumbnail);
  if (mainThumb && !images.includes(mainThumb) && images.length < 4) {
    images.push(mainThumb);
  }

  // 4. Fill up to 4 images using song covers from recommendations or last search
  if (images.length < 4 && Array.isArray(lastRecommendedTracks) && lastRecommendedTracks.length) {
    lastRecommendedTracks.forEach(t => {
      const thumb = safeThumb(t.thumbnail);
      if (thumb && !images.includes(thumb) && images.length < 4) {
        images.push(thumb);
      }
    });
  }

  // 5. Fill any remaining slots with curated aesthetic cover palette
  let offset = (fallbackIdx * 3) % PLAYLIST_COVER_PALETTE.length;
  while (images.length < 4) {
    const fallbackUrl = PLAYLIST_COVER_PALETTE[offset % PLAYLIST_COVER_PALETTE.length];
    if (!images.includes(fallbackUrl) || images.length >= PLAYLIST_COVER_PALETTE.length) {
      images.push(fallbackUrl);
    }
    offset++;
  }

  return images.slice(0, 4);
}

function renderPlaylistsCards(container, playlists) {
  if (!container || !Array.isArray(playlists) || !playlists.length) return;
  const frag = document.createDocumentFragment();

  playlists.slice(0, 6).forEach((pl, idx) => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    const fourImgs = getPlaylist4Images(pl, idx);
    const mainThumb = safeThumb(pl.thumbnail || fourImgs[0]);

    card.innerHTML = `
      <div class="playlist-grid-4">
        <img loading="lazy" src="${fourImgs[0]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[1]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[2]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[3]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">${escapeHtml(pl.name)}</h3>
        <p class="playlist-desc">${escapeHtml(pl.author ? 'By ' + pl.author : (pl.desc || 'Curated playlist'))}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (pl.playlistId) openPlaylistDetails(pl.playlistId, pl.name, pl.author, mainThumb);
      else if (pl.query) executeSearch(pl.query, 'songs');
      else executeSearch(pl.name, 'all');
    });

    frag.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(frag);
}

function renderPlaylistsSection(playlists) {
  if (!searchPlaylistsBlock || !searchPlaylistsGrid) return;
  searchPlaylistsBlock.classList.remove('hidden');
  renderPlaylistsCards(searchPlaylistsGrid, playlists);
}

async function renderRecommendedPlaylists(fallbackQuery = '') {
  const homePlaylists = $('homePlaylistsGrid');
  const searchBrowsePlaylists = $('searchBrowsePlaylistsGrid');
  if (!homePlaylists && !searchBrowsePlaylists) return;

  // 1. Try reading stored recommended playlists from previous searches
  try {
    const stored = JSON.parse(localStorage.getItem('sonora_recommended_playlists') || 'null');
    if (stored && Array.isArray(stored) && stored.length) {
      const shuffled = shuffleArray(stored);
      if (homePlaylists) renderPlaylistsCards(homePlaylists, shuffled);
      if (searchBrowsePlaylists) renderPlaylistsCards(searchBrowsePlaylists, shuffleArray(stored));
      return;
    }
  } catch (e) { }

  // 2. Fetch playlists matching the user's latest search or history seed
  try {
    let query = fallbackQuery;
    if (!query) {
      const lastSearch = JSON.parse(localStorage.getItem('sonora_last_search') || 'null');
      if (lastSearch && lastSearch.query) {
        query = lastSearch.query;
      } else if (userHistory && userHistory[0]) {
        query = userHistory[0].artist || userHistory[0].name || '';
      }
    }
    query = (query || 'Top Hits').trim();

    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&type=playlists`);
    const data = await res.json();
    const playlists = Array.isArray(data) ? data : (data.playlists || []);
    if (playlists && playlists.length) {
      localStorage.setItem('sonora_recommended_playlists', JSON.stringify(playlists));
      const shuffled = shuffleArray(playlists);
      if (homePlaylists) renderPlaylistsCards(homePlaylists, shuffled);
      if (searchBrowsePlaylists) renderPlaylistsCards(searchBrowsePlaylists, shuffleArray(playlists));
    }
  } catch (e) { }
}

async function openArtistDetails(artistId, name, thumbnail) {
  if (searchResultsWrapper) searchResultsWrapper.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.remove('hidden');

  if (detailHeader) {
    detailHeader.innerHTML = `
      <img class="detail-cover is-artist" loading="lazy" src="${safeThumb(thumbnail)}" alt="${escapeHtml(name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="detail-info">
        <span class="detail-type">ARTIST</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">Popular tracks</p>
      </div>
    `;
  }

  if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading artist tracks...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/artist/${artistId}`);
    const data = await res.json();
    const songs = (data.songs || data.results || []).map(s => ({
      videoId: s.videoId,
      name: s.name || s.title,
      artist: name,
      album: s.album?.name || '',
      thumbnail: s.thumbnails?.[0]?.url || thumbnail || FALLBACK_THUMB,
      duration: s.duration || s.duration_seconds || 200
    }));

    if (songs.length) {
      renderDetailTracks(songs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(songs[0], songs);
    } else {
      const searchRes = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(name)}&type=songs`);
      const fallbackSongs = await searchRes.json();
      renderDetailTracks(fallbackSongs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(fallbackSongs[0], fallbackSongs);
    }
  } catch (e) {
    if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Failed to load artist tracks.</div>';
  }
}

async function openAlbumDetails(albumId, name, artist, thumbnail) {
  if (searchResultsWrapper) searchResultsWrapper.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.remove('hidden');

  if (detailHeader) {
    detailHeader.innerHTML = `
      <img class="detail-cover" loading="lazy" src="${safeThumb(thumbnail)}" alt="${escapeHtml(name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="detail-info">
        <span class="detail-type">ALBUM</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">By ${escapeHtml(artist || 'Various Artists')}</p>
      </div>
    `;
  }

  if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading album tracks...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/album/${albumId}`);
    const data = await res.json();
    const songs = (data.tracks || data.songs || []).map(s => ({
      videoId: s.videoId,
      name: s.name || s.title,
      artist: artist || name,
      album: name,
      thumbnail: thumbnail || FALLBACK_THUMB,
      duration: s.duration || s.duration_seconds || 200
    }));

    if (songs.length) {
      renderDetailTracks(songs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(songs[0], songs);
    } else {
      const searchRes = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(name + ' ' + (artist || ''))}&type=songs`);
      const fallbackSongs = await searchRes.json();
      renderDetailTracks(fallbackSongs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(fallbackSongs[0], fallbackSongs);
    }
  } catch (e) {
    if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Failed to load album tracks.</div>';
  }
}

async function openPlaylistDetails(playlistId, name, author, thumbnail) {
  if (searchResultsWrapper) searchResultsWrapper.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.remove('hidden');

  if (detailHeader) {
    detailHeader.innerHTML = `
      <img class="detail-cover" loading="lazy" src="${safeThumb(thumbnail)}" alt="${escapeHtml(name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="detail-info">
        <span class="detail-type">PLAYLIST</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">Curated by ${escapeHtml(author || 'YT Music')}</p>
      </div>
    `;
  }

  if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading playlist tracks...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/playlist/${playlistId}`);
    const data = await res.json();
    const songs = (data.videos || data.tracks || []).map(s => ({
      videoId: s.videoId,
      name: s.title || s.name,
      artist: s.artist?.name || s.author || 'Various Artists',
      album: name,
      thumbnail: s.thumbnail || thumbnail || FALLBACK_THUMB,
      duration: s.duration || s.duration_seconds || 200
    }));

    if (songs.length) {
      renderDetailTracks(songs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(songs[0], songs);
    } else {
      const searchRes = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(name)}&type=songs`);
      const fallbackSongs = await searchRes.json();
      renderDetailTracks(fallbackSongs);
      if (detailPlayAllBtn) detailPlayAllBtn.onclick = () => playTrack(fallbackSongs[0], fallbackSongs);
    }
  } catch (e) {
    if (detailTrackList) detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Failed to load playlist tracks.</div>';
  }
}

function renderDetailTracks(songs) {
  if (!detailTrackList) return;
  const frag = document.createDocumentFragment();

  songs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');
    const isLiked = isSongLiked(song.videoId);

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" loading="lazy" src="${safeThumb(song.thumbnail)}" alt="${escapeHtml(song.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(song.name)}</span>
        <span class="track-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(song.album || '')}</span>
      <span class="track-time">${formatTime(song.duration || song.duration_seconds || song.length)}</span>
      <button class="like-heart-btn ${isLiked ? 'active' : ''}">${isLiked ? HEART_FILLED : HEART_OUTLINE}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(song);
        const btn = row.querySelector('.like-heart-btn');
        const nowLiked = isSongLiked(song.videoId);
        btn.classList.toggle('active', nowLiked);
        btn.innerHTML = nowLiked ? HEART_FILLED : HEART_OUTLINE;
        return;
      }
      playTrack(song, songs);
    });

    frag.appendChild(row);
  });

  detailTrackList.innerHTML = '';
  detailTrackList.appendChild(frag);
}

async function fetchAndPlaySearch(query) {
  let q = (query || '').trim().replace(/[\(\[\{].*?[\)\]\}]/g, '').replace(/["']/g, '').trim();
  if (!q) return;

  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}&type=songs`);
    const data = await res.json();
    const songs = Array.isArray(data) ? data : (data.songs || []);

    if (songs && songs.length) {
      const target = songs[0];
      const videoId = target.videoId || (typeof target.id === 'object' ? target.id.videoId : target.id);
      playTrack({ ...target, videoId }, songs);

      // Persist search results so recommendations survive page reload
      lastRecommendedTracks = songs.slice(0, 10);
      persistLastSearch(songs, q);
      renderSearchBrowseSuggestions();
    } else {
      showToast(`No results for "${q}"`);
    }
  } catch (e) {
    showToast('Search failed');
  }
}

function isSongLiked(idOrTitle) {
  if (!idOrTitle) return false;
  return likedSongs.some(s => s.videoId === idOrTitle || s.name === idOrTitle);
}

function toggleLikeSong(track) {
  const idx = likedSongs.findIndex(s => (track.videoId && s.videoId === track.videoId) || s.name === track.name);
  if (idx !== -1) {
    likedSongs.splice(idx, 1);
    showToast('Removed from Liked Songs');
  } else {
    likedSongs.push(track);
    showToast('Added to Liked Songs');
  }

  localStorage.setItem('sonora_liked_songs', JSON.stringify(likedSongs));
  setTrackInfo(currentTrack || track);
  updateActiveRowVisuals();
  renderLikedSongsView();
}

function renderLikedSongsView() {
  if (!likedSongsList) return;
  if (!likedSongs.length) {
    likedSongsList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">No liked songs yet. Click the heart icon on any track to save it here.</div>';
    return;
  }
  renderTrackRows(likedSongsList, likedSongs);
}

function renderLibraryView(tab = 'songs') {
  if (!libraryTrackList) return;
  if (tab === 'songs') {
    if (!likedSongs.length) {
      libraryTrackList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">No saved songs found in your library.</div>';
      return;
    }
    renderTrackRows(libraryTrackList, likedSongs);
  } else {
    libraryTrackList.innerHTML = `<div style="padding: 24px 0; color: var(--text-muted);">${capitalize(tab)} will appear here.</div>`;
  }
}

function setupPlaylistsModal() {
  if (newPlaylistBtn) newPlaylistBtn.addEventListener('click', () => createPlaylistModal.classList.remove('hidden'));
  if (makeRoomCard) makeRoomCard.addEventListener('click', () => createPlaylistModal.classList.remove('hidden'));
  if (cancelPlaylistBtn) cancelPlaylistBtn.addEventListener('click', () => createPlaylistModal.classList.add('hidden'));

  if (confirmPlaylistBtn) {
    confirmPlaylistBtn.addEventListener('click', () => {
      const name = newPlaylistNameInput.value.trim();
      const desc = newPlaylistDescInput.value.trim() || 'Custom playlist';
      if (!name) {
        showToast('Enter a playlist name');
        return;
      }

      customPlaylists.push({ id: 'pl_' + Date.now(), name, desc, tracks: [] });
      localStorage.setItem('sonora_playlists', JSON.stringify(customPlaylists));

      newPlaylistNameInput.value = '';
      newPlaylistDescInput.value = '';
      createPlaylistModal.classList.add('hidden');
      showToast(`Created playlist "${name}"`);
      renderCustomPlaylists();
    });
  }
}

function renderCustomPlaylists() {
  if (!playlistsGrid) return;
  const frag = document.createDocumentFragment();

  customPlaylists.forEach((pl, idx) => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    const fourImgs = getPlaylist4Images(pl, idx);
    card.innerHTML = `
      <div class="playlist-grid-4">
        <img loading="lazy" src="${fourImgs[0]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[1]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[2]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
        <img loading="lazy" src="${fourImgs[3]}" alt="${escapeHtml(pl.name)}" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">${escapeHtml(pl.name)}</h3>
        <p class="playlist-desc">${escapeHtml(pl.desc || 'Custom playlist')}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (pl.tracks && pl.tracks.length) playTrack(pl.tracks[0], pl.tracks);
      else showToast(`Playlist "${pl.name}" is empty`);
    });

    frag.appendChild(card);
  });

  const createCard = document.createElement('div');
  createCard.className = 'playlist-card playlist-card--create';
  createCard.innerHTML = `
    <div class="create-room-icon">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    </div>
    <span class="create-room-text">Make a new room</span>
  `;
  createCard.addEventListener('click', () => createPlaylistModal.classList.remove('hidden'));
  frag.appendChild(createCard);

  playlistsGrid.innerHTML = '';
  playlistsGrid.appendChild(frag);
}

function setupLyricsDrawer() {
  if (lyricsToggleBtn) {
    lyricsToggleBtn.addEventListener('click', () => {
      lyricsDrawer.classList.toggle('hidden');
      if (!lyricsDrawer.classList.contains('hidden') && currentTrack) {
        fetchAndRenderLyrics(currentTrack);
      }
    });
  }

  if (closeLyricsBtn) {
    closeLyricsBtn.addEventListener('click', () => lyricsDrawer.classList.add('hidden'));
  }
}

async function fetchAndRenderLyrics(track) {
  if (lyricsSongTitle) lyricsSongTitle.textContent = track.name || 'Unknown Track';
  if (lyricsSongArtist) lyricsSongArtist.textContent = track.artist || 'Unknown Artist';
  if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Fetching lyrics...</p>';

  if (!track || (!track.videoId && !track.name)) {
    if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics unavailable for this track.</p>';
    return;
  }

  try {
    const title = track.name || '';
    const artist = track.artist || '';
    const duration = track.duration || 0;
    const res = await fetch(`${API_BASE}/api/lyrics/${track.videoId || 'unknown'}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&duration=${duration}`);
    const data = await res.json();
    const lines = data.lines || [];

    if (Array.isArray(lines) && lines.length) {
      const frag = document.createDocumentFragment();
      lines.forEach((lineObj, idx) => {
        const p = document.createElement('p');
        p.className = 'lyrics-line';
        p.style.setProperty('--line-idx', Math.min(idx, 28));
        const text = typeof lineObj === 'string' ? lineObj : (lineObj.text || '');
        p.textContent = text;
        if (lineObj && typeof lineObj === 'object' && lineObj.time !== undefined) {
          p.dataset.time = lineObj.time;
          p.addEventListener('click', () => {
            const seekTarget = parseFloat(lineObj.time);
            if (ytPlayer && isPlayerReady) ytPlayer.seekTo(seekTarget, true);
            if (bgAudioBridge && !bgAudioBridge.paused) bgAudioBridge.currentTime = seekTarget;
          });
        }
        frag.appendChild(p);
      });
      lyricsContent.innerHTML = '';
      lyricsContent.appendChild(frag);
    } else {
      if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics not available for this song.</p>';
    }
  } catch (e) {
    if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Unable to load lyrics at this time.</p>';
  }
}

function recordSongToHistory(track) {
  if (!track || !track.name) return;
  const existingIdx = userHistory.findIndex(h => (track.videoId && h.videoId === track.videoId) || (h.name && h.name.toLowerCase() === track.name.toLowerCase()));
  if (existingIdx !== -1) userHistory.splice(existingIdx, 1);

  const historyItem = {
    videoId: track.videoId || '',
    name: track.name || '',
    artist: track.artist || 'Unknown Artist',
    album: track.album || '',
    thumbnail: track.thumbnail || FALLBACK_THUMB,
    duration: track.duration || 0,
    timestamp: Date.now()
  };
  userHistory.unshift(historyItem);
  if (userHistory.length > 15) userHistory.length = 15;

  try {
    localStorage.setItem('sonora_user_history', JSON.stringify(userHistory));
  } catch (e) { }

  if (typeof forYouFeed !== 'undefined' && forYouFeed.initialized) {
    forYouFeed.seedPool.unshift(historyItem);
  }
}

async function renderPersonalizedHomeFeed() {
  const homeTrackList = $('homeTrackList');
  const homeAlbumsGrid = $('homeAlbumsGrid');
  if (!homeTrackList) return;

  const tastePool = [];
  const tasteSeen = new Set();

  function addToTaste(track) {
    if (!track) return;
    const key = track.videoId || track.name;
    if (key && !tasteSeen.has(key)) {
      tasteSeen.add(key);
      tastePool.push(track);
    }
  }

  // 1. Collect user signals: liked songs, history, and persisted last search
  [...likedSongs, ...userHistory].forEach(addToTaste);

  try {
    const stored = JSON.parse(localStorage.getItem('sonora_last_search') || 'null');
    if (stored && Array.isArray(stored.songs)) {
      stored.songs.forEach(addToTaste);
    }
  } catch (e) { }

  // 2. Dynamically fetch related tracks for a randomly picked seed on every refresh
  try {
    const availableSeeds = tastePool.filter(t => t && t.videoId);
    if (availableSeeds.length > 0) {
      const randomSeed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
      if (randomSeed && randomSeed.videoId) {
        const res = await fetch(`${API_BASE}/api/upnext/${randomSeed.videoId}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          data.forEach(s => addToTaste({
            videoId: s.videoId,
            name: s.name || s.title || 'Untitled',
            artist: s.artist?.name || s.artist || 'Unknown',
            album: s.album?.name || s.album || '',
            thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
            duration: s.duration || 200
          }));
        }
      }
    }
  } catch (e) { }

  // 3. Always merge fresh global mix hits to ensure deep variety
  try {
    const res = await fetch(`${API_BASE}/api/global-mix?_r=${Date.now()}`);
    const data = await res.json();
    const raw = Array.isArray(data) ? data : (data.tracks || data.songs || []);
    if (Array.isArray(raw)) {
      raw.forEach(s => addToTaste({
        videoId: s.videoId || (typeof s.id === 'object' ? s.id.videoId : s.id) || '',
        name: s.name || s.title || 'Untitled Track',
        artist: s.artist?.name || s.artist || 'Various Artists',
        album: s.album?.name || s.album || 'Single',
        thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
        duration: s.duration || s.duration_seconds || s.length || 200
      }));
    }
  } catch (e) { }

  // 4. Randomize selection and order on every page refresh
  const shuffledTracks = shuffleArray(tastePool);
  const homeTracks = shuffledTracks.slice(0, 10);
  const albumTracks = shuffleArray(tastePool).slice(0, 6);

  renderTrackRows(homeTrackList, homeTracks);
  if (homeAlbumsGrid) renderAlbumCards(homeAlbumsGrid, albumTracks);
  lastRecommendedTracks = homeTracks;
  renderRecommendedPlaylists();
  renderSearchBrowseSuggestions();
}

async function renderSearchBrowseSuggestions() {
  const songsList = $('searchBrowseSongsList');
  const albumsGrid = $('searchBrowseAlbumsGrid');
  if (!songsList) return;

  renderRecommendedPlaylists();

  if (lastRecommendedTracks && lastRecommendedTracks.length >= 5) {
    const shuffledSuggestions = shuffleArray(lastRecommendedTracks);
    renderTrackRows(songsList, shuffledSuggestions);
    if (albumsGrid) renderAlbumCards(albumsGrid, shuffleArray(lastRecommendedTracks).slice(0, 5));
    return;
  }

  // Fallback: try localStorage persisted search
  try {
    const stored = JSON.parse(localStorage.getItem('sonora_last_search') || 'null');
    if (stored && Array.isArray(stored.songs) && stored.songs.length) {
      const shuffledStored = shuffleArray(stored.songs);
      lastRecommendedTracks = shuffledStored.slice(0, 10);
      renderTrackRows(songsList, lastRecommendedTracks);
      if (albumsGrid) renderAlbumCards(albumsGrid, lastRecommendedTracks.slice(0, 5));
      return;
    }
  } catch (e) { }

  try {
    const res = await fetch(`${API_BASE}/api/global-mix?_r=${Date.now()}`);
    const tracks = await res.json();
    if (Array.isArray(tracks) && tracks.length) {
      const shuffledMix = shuffleArray(tracks);
      renderTrackRows(songsList, shuffledMix.slice(0, 10));
      if (albumsGrid) renderAlbumCards(albumsGrid, shuffledMix.slice(0, 5));
    }
  } catch (e) { }
}

function addRecentSearch(query) {
  const q = (query || '').trim();
  if (!q) return;
  recentSearches = recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase());
  recentSearches.unshift(q);
  if (recentSearches.length > 10) recentSearches.length = 10;
  try {
    localStorage.setItem('sonora_recent_searches', JSON.stringify(recentSearches));
  } catch (e) { }
  renderRecentSearches();
}

function removeRecentSearch(query) {
  recentSearches = recentSearches.filter(s => s !== query);
  try {
    localStorage.setItem('sonora_recent_searches', JSON.stringify(recentSearches));
  } catch (e) { }
  renderRecentSearches();
}

function renderRecentSearches() {
  const row = $('recentSearchesRow');
  if (!row) return;
  if (!recentSearches.length) {
    row.classList.add('hidden');
    row.innerHTML = '';
    return;
  }

  row.classList.remove('hidden');
  const frag = document.createDocumentFragment();
  const label = document.createElement('span');
  label.className = 'recent-searches-label';
  label.textContent = 'Recent';
  frag.appendChild(label);

  recentSearches.forEach(q => {
    const chip = document.createElement('div');
    chip.className = 'recent-search-chip';
    chip.innerHTML = `
      <span class="recent-search-text">${escapeHtml(q)}</span>
      <button class="recent-search-remove" title="Remove">&times;</button>
    `;

    chip.querySelector('.recent-search-text').addEventListener('click', () => {
      if (pageSearchInput) pageSearchInput.value = q;
      if (searchInput) searchInput.value = q;
      executeSearch(q, currentFilter);
    });

    chip.querySelector('.recent-search-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecentSearch(q);
    });

    frag.appendChild(chip);
  });

  row.innerHTML = '';
  row.appendChild(frag);
}

function toggleEasyMode(enable) {
  isEasyMode = enable != null ? enable : !isEasyMode;
  if (easyModeOverlay) {
    easyModeOverlay.classList.toggle('hidden', !isEasyMode);
    document.body.classList.toggle('easy-mode-open', isEasyMode);
  }
  if (isEasyMode) {
    const trackToUse = currentTrack || DEFAULT_SONG;
    updateEasyModeTrackInfo(trackToUse);
    syncEasyModeUI();
  }
}

function updateEasyModeTrackInfo(track) {
  const trackToUse = track || currentTrack || DEFAULT_SONG;
  if (easyTrackTitle) easyTrackTitle.textContent = trackToUse.name || 'Unknown Track';
  if (easyTrackArtist) easyTrackArtist.textContent = trackToUse.artist || 'Sonora';

  const thumbUrl = safeThumb(trackToUse.thumbnail);
  if (easyBgArt) easyBgArt.src = thumbUrl;
  if (easyTrackThumb) easyTrackThumb.src = thumbUrl;

  const isLiked = isSongLiked(trackToUse.videoId || trackToUse.name);
  if (easyLikeBtn) {
    easyLikeBtn.classList.toggle('active', isLiked);
    if (easyLikeIcon) easyLikeIcon.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
  }
}

function syncEasyModeUI() {
  const trackToUse = currentTrack || DEFAULT_SONG;
  if (easyPlayIcon) easyPlayIcon.innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;
  if (easyRepeatBtn) easyRepeatBtn.classList.toggle('active', isRepeat);

  if (ytPlayer && isPlayerReady) {
    const cur = ytPlayer.getCurrentTime() || 0;
    const dur = ytPlayer.getDuration() || trackToUse.duration || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (easyCurTime) easyCurTime.textContent = formatTime(cur);
    if (easyDurTime) easyDurTime.textContent = formatTime(dur);
    if (easySeekInput) {
      easySeekInput.max = dur || 100;
      easySeekInput.value = cur;
    }
    if (easyProgressFill) easyProgressFill.style.width = `${pct}%`;
  }
}

function setupEasyModeControls() {
  if (homeEasyModeBtn) homeEasyModeBtn.addEventListener('click', () => toggleEasyMode(true));
  if (easyExitBtn) easyExitBtn.addEventListener('click', () => toggleEasyMode(false));

  if (easyPlayBtn) {
    easyPlayBtn.addEventListener('click', () => {
      if (!ytPlayer || !isPlayerReady) return;
      const state = ytPlayer.getPlayerState();
      state === YT.PlayerState.PLAYING ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    });
  }

  if (easyPrevBtn) easyPrevBtn.addEventListener('click', playPrevTrack);
  if (easyNextBtn) easyNextBtn.addEventListener('click', playNextTrack);

  if (easyRepeatBtn) {
    easyRepeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      easyRepeatBtn.classList.toggle('active', isRepeat);
      if (repeatBtn) repeatBtn.classList.toggle('active', isRepeat);
      if (fsRepeatBtn) fsRepeatBtn.classList.toggle('active', isRepeat);
      showToast(isRepeat ? 'Repeat on' : 'Repeat off');
    });
  }

  if (easyLikeBtn) {
    easyLikeBtn.addEventListener('click', () => {
      if (currentTrack) {
        toggleLikeSong(currentTrack);
        const isLiked = isSongLiked(currentTrack.videoId || currentTrack.name);
        easyLikeBtn.classList.toggle('active', isLiked);
        if (easyLikeIcon) easyLikeIcon.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
      }
    });
  }

  if (easySeekInput) {
    easySeekInput.addEventListener('mousedown', () => { isDraggingEasySeek = true; });
    easySeekInput.addEventListener('touchstart', () => { isDraggingEasySeek = true; }, { passive: true });
    easySeekInput.addEventListener('input', () => {
      const val = parseFloat(easySeekInput.value);
      const max = parseFloat(easySeekInput.max) || 100;
      const pct = (val / max) * 100;
      if (easyProgressFill) easyProgressFill.style.width = `${pct}%`;
      if (easyCurTime) easyCurTime.textContent = formatTime(val);
    });
    easySeekInput.addEventListener('change', () => {
      isDraggingEasySeek = false;
      if (ytPlayer && isPlayerReady) ytPlayer.seekTo(parseFloat(easySeekInput.value), true);
    });
  }

  if (easySearchBtn) {
    easySearchBtn.addEventListener('click', () => {
      if (easySearchModal) {
        easySearchModal.classList.toggle('hidden');
        if (!easySearchModal.classList.contains('hidden') && easySearchInput) {
          easySearchInput.focus();
        }
      }
    });
  }

  if (easySearchCloseBtn) {
    easySearchCloseBtn.addEventListener('click', () => {
      if (easySearchModal) easySearchModal.classList.add('hidden');
    });
  }

  let easyDebounceTimer = null;
  if (easySearchInput) {
    easySearchInput.addEventListener('input', () => {
      const query = easySearchInput.value.trim();
      clearTimeout(easyDebounceTimer);
      if (!query) {
        if (easySearchResults) easySearchResults.innerHTML = '';
        return;
      }
      easyDebounceTimer = setTimeout(() => executeEasySearch(query), 250);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isEasyMode) {
      if (easySearchModal && !easySearchModal.classList.contains('hidden')) {
        easySearchModal.classList.add('hidden');
      } else {
        toggleEasyMode(false);
      }
    }
  });
}

async function executeEasySearch(query) {
  if (!easySearchResults) return;
  easySearchResults.innerHTML = '<div style="padding:12px;color:rgba(255,255,255,0.6);text-align:center;">Searching...</div>';
  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    const songs = data.songs || [];
    if (!songs.length) {
      easySearchResults.innerHTML = '<div style="padding:12px;color:rgba(255,255,255,0.6);text-align:center;">No results found</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    songs.slice(0, 6).forEach(s => {
      const item = document.createElement('div');
      item.className = 'easy-search-item';
      item.innerHTML = `
        <img class="easy-search-thumb" loading="lazy" src="${safeThumb(s.thumbnail)}" alt="" />
        <div class="easy-search-meta">
          <h4>${escapeHtml(s.name || s.title || 'Unknown')}</h4>
          <p>${escapeHtml(s.artist?.name || s.artist || 'Unknown')}</p>
        </div>
      `;
      item.addEventListener('click', () => {
        const track = {
          videoId: s.videoId,
          name: s.name || s.title,
          artist: s.artist?.name || s.artist || 'Unknown',
          album: s.album?.name || '',
          thumbnail: s.thumbnail || FALLBACK_THUMB,
          duration: s.duration || 200
        };
        playTrack(track, songs);
        if (easySearchModal) easySearchModal.classList.add('hidden');
      });
      frag.appendChild(item);
    });
    easySearchResults.innerHTML = '';
    easySearchResults.appendChild(frag);
  } catch (e) {
    easySearchResults.innerHTML = '<div style="padding:12px;color:rgba(255,255,255,0.6);text-align:center;">Search failed</div>';
  }
}

function safeThumb(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return FALLBACK_THUMB;
  return url;
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function updateMediaSessionMetadata(track) {
  if (!('mediaSession' in navigator) || !track) return;
  const artworkUrl = safeThumb(track.thumbnail);
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.name || 'Unknown Track',
    artist: track.artist || 'Sonora',
    album: track.album || 'Sonora Record',
    artwork: [{ src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }]
  });
}

function setupMediaSession() {
  if (!('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler('play', () => {
      initBgAudioBridge();
      if (ytPlayer && isPlayerReady) ytPlayer.playVideo();
      else setPlayingState(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (bgAudioBridge) bgAudioBridge.pause();
      if (ytPlayer && isPlayerReady) ytPlayer.pauseVideo();
      else setPlayingState(false);
    });
    navigator.mediaSession.setActionHandler('previoustrack', playPrevTrack);
    navigator.mediaSession.setActionHandler('nexttrack', playNextTrack);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null && ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(details.seekTime, true);
        updateProgress();
      }
    });
  } catch (e) { }
}

function setupAllAppInteractions() {
  const heroPlayBtn = $('heroPlayBtn');
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => fetchAndPlaySearch(heroPlayBtn.dataset.song || 'Tide Lines Mara Vale'));
  }

  const heroExploreMoodsBtn = $('heroExploreMoodsBtn');
  if (heroExploreMoodsBtn) {
    heroExploreMoodsBtn.addEventListener('click', () => switchView('search'));
  }

  $$('.deck-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      fetchAndPlaySearch(btn.dataset.song || 'Tide Lines Mara Vale');
    });
  });

  $$('.mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.mood-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const mood = chip.dataset.mood;
      fetchAndPlaySearch(mood === 'All' ? 'Mara Vale Tide Lines' : `${mood} chill music`);
    });
  });

  const discover = $('discoverBtn');
  if (discover) discover.addEventListener('click', () => switchView('made-for-you'));
}

const forYouFeed = {
  initialized: false,
  loading: false,
  exhausted: false,
  seedPool: [],
  seedIndex: 0,
  shownIds: new Set(),
  observer: null
};

async function initForYouFeed() {
  const container = $('madeForYouList');
  if (!container || forYouFeed.initialized) return;

  forYouFeed.initialized = true;

  // Build seed pool from liked songs, history, and last search
  let seeds = [...likedSongs, ...userHistory];
  try {
    const stored = JSON.parse(localStorage.getItem('sonora_last_search') || 'null');
    if (stored && Array.isArray(stored.songs)) {
      seeds = seeds.concat(stored.songs);
    }
  } catch (e) { }

  forYouFeed.seedPool = shuffleArray(seeds);

  const sentinel = document.createElement('div');
  sentinel.id = 'forYouScrollSentinel';
  sentinel.style.cssText = 'height:20px;width:100%;margin-top:16px;';
  container.after(sentinel);

  forYouFeed.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) loadMoreForYouTracks();
    });
  }, { root: document.getElementById('contentBody') || null, rootMargin: '350px' });

  forYouFeed.observer.observe(sentinel);
  await loadMoreForYouTracks();
}

async function loadMoreForYouTracks() {
  if (forYouFeed.loading || forYouFeed.exhausted) return;
  const container = $('madeForYouList');
  if (!container) return;

  forYouFeed.loading = true;
  try {
    let batch = [];
    if (forYouFeed.seedPool.length) {
      const seed = forYouFeed.seedPool[forYouFeed.seedIndex % forYouFeed.seedPool.length];
      forYouFeed.seedIndex++;
      if (seed && seed.videoId) {
        const res = await fetch(`${API_BASE}/api/upnext/${seed.videoId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          batch = data.map(s => ({
            videoId: s.videoId,
            name: s.name || s.title || 'Untitled',
            artist: s.artist?.name || s.artist || 'Unknown',
            album: s.album?.name || s.album || '',
            thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
            duration: s.duration || 200
          }));
        }
      }
    }

    // Fallback if batch is empty
    if (!batch.length) {
      const res = await fetch(`${API_BASE}/api/global-mix`);
      const data = await res.json();
      const raw = Array.isArray(data) ? data : (data.tracks || data.songs || []);
      if (Array.isArray(raw)) {
        batch = raw.map(s => ({
          videoId: s.videoId || '',
          name: s.name || s.title || 'Untitled',
          artist: s.artist?.name || s.artist || 'Unknown',
          album: s.album?.name || s.album || '',
          thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
          duration: s.duration || 200
        }));
      }
    }

    const freshTracks = batch.filter(t => {
      const key = t.videoId || t.name;
      return key && !forYouFeed.shownIds.has(key);
    });

    if (freshTracks.length) {
      const toRender = freshTracks.slice(0, 10);
      toRender.forEach(t => forYouFeed.shownIds.add(t.videoId || t.name));
      // Append without wiping existing tracks
      renderTrackRows(container, toRender, true);
    }
  } catch (e) {
  } finally {
    forYouFeed.loading = false;
  }
}

async function purgeAllBrowserDataAndReload(resetId) {
  try {
    if (resetId) {
      localStorage.setItem('sonora_last_reset_id', resetId);
    }
  } catch (e) { }

  // 1. Clear SessionStorage & LocalStorage
  try { sessionStorage.clear(); } catch (e) { }
  try { localStorage.clear(); } catch (e) { }

  // 2. Clear Cache Storage API (Service Worker cached files & API responses)
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    } catch (e) { }
  }

  // 3. Delete IndexedDB databases for this origin
  if ('indexedDB' in window && typeof indexedDB.databases === 'function') {
    try {
      const dbs = await indexedDB.databases();
      if (Array.isArray(dbs)) {
        dbs.forEach(db => {
          if (db && db.name) indexedDB.deleteDatabase(db.name);
        });
      }
    } catch (e) { }
  }

  // 4. Unregister Service Workers to guarantee clean assets on reload
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    } catch (e) { }
  }

  // 5. Notify server of reset execution
  try {
    await fetch(`${API_BASE}/api/confirm-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) { }

  // 6. Hard reload bypassing browser cache
  setTimeout(() => {
    window.location.replace(window.location.origin + '/?purged=' + Date.now());
  }, 200);
}

function setupRemoteCachePurgeListener() {
  async function checkForPurgeSignal() {
    try {
      const res = await fetch(`${API_BASE}/api/check-reset?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data && data.reset) {
        const lastAppliedReset = localStorage.getItem('sonora_last_reset_id');
        const currentResetId = String(data.resetId || data.timestamp || 'reset_triggered');
        if (lastAppliedReset === currentResetId && !data.forceAlways) return;

        await purgeAllBrowserDataAndReload(currentResetId);
      }
    } catch (e) { }
  }

  // Periodic poll every 8 seconds
  setInterval(checkForPurgeSignal, 8000);

  // Check immediately on tab focus or visibility change
  window.addEventListener('focus', checkForPurgeSignal);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForPurgeSignal();
    }
  });
}