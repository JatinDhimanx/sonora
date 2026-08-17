'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const app = $('app');
const sidebar = $('sidebar');
const brandLogoBtn = $('brandLogoBtn');

const navItems = $$('.nav-item');
const viewPanels = $$('.view-panel');

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

const API_BASE = '';
const PLAY_SVG = '<path d="M8 5v14l11-7z"/>';
const PAUSE_SVG = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
const HEART_FILLED = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#E05D38" stroke="#E05D38" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
const HEART_OUTLINE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80';

let ytPlayer = null;
let isPlayerReady = false;
let isPlaying = false;
let isDraggingSeek = false;
let isDraggingFsSeek = false;
let updateInterval = null;
let currentPlaylist = [];
let currentTrackIndex = -1;
let currentTrack = null;
let isMuted = false;
let lastVolume = 80;
let isShuffle = false;
let isRepeat = false;

let currentFilter = 'all';
let likedSongs = JSON.parse(localStorage.getItem('sonora_liked_songs') || '[]');
let customPlaylists = JSON.parse(localStorage.getItem('sonora_playlists') || '[]');
let lastRecommendedTracks = [];
let viewStack = ['home'];
let viewStackIndex = 0;

const DEFAULT_SONG = {
  videoId: 'dQw4w9WgXcQ',
  name: 'Still Water',
  artist: 'Mara Vale · Tide Lines',
  album: 'Tide Lines',
  thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  duration: 232
};

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
  updateTimeTag();

  renderLikedSongsView();
  renderCustomPlaylists();
  renderPersonalizedHomeFeed();
  renderRecentSearches();
  setTrackInfo(DEFAULT_SONG);
});

function setupBatteryOptButton() {
  const batteryBtn = $('batteryOptBtn');
  if (batteryBtn) {
    batteryBtn.addEventListener('click', () => {
      showToast('To keep audio playing in the background, ensure background playback permissions are enabled in your browser settings.');
    });
  }
}

let deferredInstallPrompt = null;

function setupAppInstallation() {
  const installBtn = $('installAppBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) {
      installBtn.classList.remove('hidden');
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast('Sonora App installed on your system!');
        }
        deferredInstallPrompt = null;
        installBtn.classList.add('hidden');
      } else {
        showToast('Use your browser menu (or top address bar) to install Sonora App!');
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (installBtn) installBtn.classList.add('hidden');
    showToast('Sonora App installed successfully!');
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.update();
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                window.location.reload();
              }
            };
          }
        };
      }).catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
    });
  }
}

function updateTimeTag() {
  const el = $('currentTimeTag');
  if (!el) return;
  const now = new Date();
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const dayName = days[now.getDay()];
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  el.textContent = `${dayName} · ${hours}:${minutes} ${ampm}`;
}

function setupNavigation() {
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
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

  viewPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== `view${capitalize(viewName)}`);
  });

  if (viewName !== 'search' && topSearchWrap) {
    topSearchWrap.classList.add('hidden');
  }

  if (viewName === 'liked-songs') {
    renderLikedSongsView();
  } else if (viewName === 'library') {
    renderLibraryView('songs');
  } else if (viewName === 'playlists') {
    renderCustomPlaylists();
  } else if (viewName === 'made-for-you') {
    initForYouFeed();
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '1',
    width: '1',
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
    events: {
      onReady: (event) => {
        isPlayerReady = true;
        event.target.setVolume(lastVolume);
        if (currentTrack && currentTrack.videoId) {
          ytPlayer.loadVideoById(currentTrack.videoId);
        }
      },
      onStateChange: onPlayerStateChange,
      onError: (event) => {
        console.warn('YouTube Player error:', event.data);
        if (currentTrack && currentTrack.videoId && bgAudioBridge) {
          bgAudioBridge.src = `${API_BASE}/api/stream/${currentTrack.videoId}`;
          bgAudioBridge.play().then(() => {
            setPlayingState(true);
            startProgressTimer();
          }).catch(() => {
            showToast('Playback error on track, skipping...');
            setTimeout(playNextTrack, 1000);
          });
        } else {
          showToast('Playback error on track, skipping...');
          setTimeout(playNextTrack, 1000);
        }
      }
    }
  });
};

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    setPlayingState(true);
    startProgressTimer();
  } else if (event.data === YT.PlayerState.PAUSED) {
    setPlayingState(false);
    stopProgressTimer();
  } else if (event.data === YT.PlayerState.ENDED) {
    setPlayingState(false);
    stopProgressTimer();
    if (isRepeat && currentTrack) {
      ytPlayer.seekTo(0);
      ytPlayer.playVideo();
    } else {
      playNextTrack();
    }
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (isPlaying) {
      initBgAudioBridge();
    }
  } else if (document.visibilityState === 'visible') {
    if (isPlaying) {
      if (bgAudioBridge && !bgAudioBridge.paused) {
        try {
          const bgTime = bgAudioBridge.currentTime || 0;
          if (ytPlayer && isPlayerReady && bgTime > 0) {
            ytPlayer.seekTo(bgTime, true);
            ytPlayer.playVideo();
          }
        } catch (e) {}
      }
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
      } catch (e) {}
    }
  } else if (!bgAudioBridge.src || bgAudioBridge.src !== SILENT_AUDIO_SRC) {
    bgAudioBridge.src = SILENT_AUDIO_SRC;
  }
  bgAudioBridge.play().catch(() => {});
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

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playPrevTrack();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNextTrack();
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null && ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(details.seekTime, true);
        updateProgress();
      }
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      if (ytPlayer && isPlayerReady) {
        const cur = ytPlayer.getCurrentTime() || 0;
        const skip = details.seekOffset || 10;
        ytPlayer.seekTo(Math.max(cur - skip, 0), true);
        updateProgress();
      }
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      if (ytPlayer && isPlayerReady) {
        const cur = ytPlayer.getCurrentTime() || 0;
        const skip = details.seekOffset || 10;
        ytPlayer.seekTo(cur + skip, true);
        updateProgress();
      }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      if (bgAudioBridge) bgAudioBridge.pause();
      if (ytPlayer && isPlayerReady) ytPlayer.stopVideo();
      setPlayingState(false);
    });
  } catch (e) {
    console.warn('MediaSession handler setup issue:', e);
  }
}

function updateMediaSessionMetadata(track) {
  if (!('mediaSession' in navigator) || !track) return;

  const artworkUrl = track.thumbnail || FALLBACK_THUMB;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.name || 'Unknown Track',
    artist: track.artist || 'Sonora',
    album: track.album || 'Sonora Record',
    artwork: [
      { src: artworkUrl, sizes: '96x96', type: 'image/jpeg' },
      { src: artworkUrl, sizes: '128x128', type: 'image/jpeg' },
      { src: artworkUrl, sizes: '192x192', type: 'image/jpeg' },
      { src: artworkUrl, sizes: '256x256', type: 'image/jpeg' },
      { src: artworkUrl, sizes: '384x384', type: 'image/jpeg' },
      { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }
    ]
  });
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
    initBgAudioBridge();
  } else if (bgAudioBridge) {
    bgAudioBridge.pause();
  }

  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  updateActiveRowVisuals();
}

let animationFrameId = null;

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

function updateProgress() {
  let cur = 0;
  let dur = (currentTrack && currentTrack.duration) ? currentTrack.duration : 0;

  if (bgAudioBridge && !bgAudioBridge.paused && bgAudioBridge.duration > 0) {
    cur = bgAudioBridge.currentTime || 0;
    dur = bgAudioBridge.duration || dur;
  } else if (ytPlayer && isPlayerReady) {
    try {
      cur = ytPlayer.getCurrentTime() || 0;
      dur = ytPlayer.getDuration() || dur;
    } catch (e) {}
  }

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  if (!isDraggingSeek) {
    if (curTimeEl) curTimeEl.textContent = formatTime(cur);
    if (durTimeEl) durTimeEl.textContent = formatTime(dur);
    if (seekInput) {
      seekInput.max = dur || 100;
      seekInput.value = cur;
    }
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressThumb) progressThumb.style.left = `${pct}%`;
  }

  if (!isDraggingFsSeek && fsSeekInput) {
    if (fsCurTime) fsCurTime.textContent = formatTime(cur);
    if (fsDurTime) fsDurTime.textContent = formatTime(dur);
    fsSeekInput.max = dur || 100;
    fsSeekInput.value = cur;
    if (fsProgressFill) fsProgressFill.style.width = `${pct}%`;
    if (fsProgressThumb) fsProgressThumb.style.left = `${pct}%`;
  }

  if (!isDraggingEasySeek && easySeekInput) {
    if (easyCurTime) easyCurTime.textContent = formatTime(cur);
    if (easyDurTime) easyDurTime.textContent = formatTime(dur);
    easySeekInput.max = dur || 100;
    easySeekInput.value = cur;
    if (easyProgressFill) easyProgressFill.style.width = `${pct}%`;
  }

  if (fullscreenPlayer && fullscreenPlayer.classList.contains('lyrics-active')) {
    syncFullscreenLyricsProgress(cur);
  }

  if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession && dur > 0 && isPlaying) {
    try {
      navigator.mediaSession.setPositionState({
        duration: dur,
        playbackRate: 1,
        position: Math.min(cur, dur)
      });
    } catch (e) {}
  }
}

function formatTime(seconds) {
  if (!seconds || seconds === '0:00') return '';

  if (typeof seconds === 'string' && seconds.includes(':')) {
    return seconds;
  }

  const sec = typeof seconds === 'string' ? parseInt(seconds, 10) : Number(seconds);

  if (isNaN(sec) || sec <= 0) return '';

  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
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
      if (!currentTrack) return;
      toggleLikeSong(currentTrack);
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
    volInput.addEventListener('input', () => {
      setVolume(parseInt(volInput.value));
    });
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
  if (expandBtn) {
    expandBtn.addEventListener('click', openFullscreen);
  }

  const playerLeft = document.querySelector('.player-left');
  if (playerLeft) {
    playerLeft.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) return;
      openFullscreen();
    });
  }

  if (closeFullscreenBtn) {
    closeFullscreenBtn.addEventListener('click', closeFullscreen);
  }

  if (fsLyricsBtn) {
    fsLyricsBtn.addEventListener('click', () => {
      if (!fullscreenPlayer) return;
      const isLyricsActive = fullscreenPlayer.classList.toggle('lyrics-active');
      fsLyricsBtn.classList.toggle('active', isLyricsActive);

      const fsRightLyricsCol = $('fsRightLyricsCol');
      if (fsRightLyricsCol) {
        fsRightLyricsCol.classList.toggle('hidden', !isLyricsActive);
      }

      if (isLyricsActive && currentTrack) {
        fetchAndRenderFullscreenLyrics(currentTrack);
      }
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
      if (!currentTrack) return;
      toggleLikeSong(currentTrack);
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

function upgradeThumbToHD(url) {
  if (!url) return FALLBACK_THUMB;
  
  let hd = url.replace(/=w\d+-h\d+/, '=w512-h512')
              .replace(/=s\d+/, '=s512')
              .replace(/=w\d+/, '=w512');
              
  if (hd.includes('ytimg.com')) {
    hd = hd.replace('/default.jpg', '/hqdefault.jpg');
  }
  return hd;
}

function syncFullscreenUI() {
  if (!currentTrack) return;
  if (fsTrackTitle) fsTrackTitle.textContent = currentTrack.name || 'Unknown Track';
  if (fsTrackArtist) fsTrackArtist.textContent = currentTrack.artist || 'Unknown Artist';
  if (fsHeaderAlbum) fsHeaderAlbum.textContent = currentTrack.album || 'Sonora Record';
  
  if (currentTrack.thumbnail) {
    const hdThumb = upgradeThumbToHD(currentTrack.thumbnail);
    if (fsAlbumArt) fsAlbumArt.src = hdThumb;
    if (fsBackdropBlur) fsBackdropBlur.style.backgroundImage = `url('${hdThumb}')`;
  }

  const isLiked = isSongLiked(currentTrack.videoId || currentTrack.name);
  if (fsLikeBtn) {
    fsLikeBtn.classList.toggle('active', isLiked);
    fsLikeBtn.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
  }

  if (fsShuffleBtn) fsShuffleBtn.classList.toggle('active', isShuffle);
  if (fsRepeatBtn) fsRepeatBtn.classList.toggle('active', isRepeat);
  if (fsPlayBtnIcon) fsPlayBtnIcon.innerHTML = isPlaying ? PAUSE_SVG : PLAY_SVG;

  if (ytPlayer && isPlayerReady) {
    const cur = ytPlayer.getCurrentTime() || 0;
    const dur = ytPlayer.getDuration() || (currentTrack ? currentTrack.duration : 0);
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (fsCurTime) fsCurTime.textContent = formatTime(cur);
    if (fsDurTime) fsDurTime.textContent = formatTime(dur);
    if (fsSeekInput) {
      fsSeekInput.max = dur || 100;
      fsSeekInput.value = cur;
    }
    if (fsProgressFill) fsProgressFill.style.width = `${pct}%`;
    if (fsProgressThumb) fsProgressThumb.style.left = `${pct}%`;
  } else {
    if (fsCurTime) fsCurTime.textContent = '0:00';
    if (fsDurTime) fsDurTime.textContent = formatTime(currentTrack.duration || 0);
    if (fsSeekInput) {
      fsSeekInput.max = currentTrack.duration || 100;
      fsSeekInput.value = 0;
    }
    if (fsProgressFill) fsProgressFill.style.width = '0%';
    if (fsProgressThumb) fsProgressThumb.style.left = '0%';
  }
}

function setVolume(v) {
  lastVolume = v > 0 ? v : lastVolume;
  if (volFill) volFill.style.width = `${v}%`;
  if (volThumb) volThumb.style.left = `${v}%`;
  if (volInput) volInput.value = v;
  if (ytPlayer && isPlayerReady) {
    ytPlayer.setVolume(v);
  }
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

  if (track.videoId) {
    if (isPlayerReady && ytPlayer) {
      try {
        ytPlayer.loadVideoById(track.videoId);
      } catch (e) {
        initBgAudioBridge();
      }
    } else {
      initBgAudioBridge();
      const checkTimer = setInterval(() => {
        if (isPlayerReady && ytPlayer) {
          clearInterval(checkTimer);
          try { ytPlayer.loadVideoById(track.videoId); } catch(e) {}
        }
      }, 100);
      setTimeout(() => clearInterval(checkTimer), 3000);
    }
  } else if (track.query || track.name) {
    fetchAndPlaySearch(track.query || `${track.name} ${track.artist || ''}`);
  }

  updateActiveRowVisuals();

  if (lyricsDrawer && !lyricsDrawer.classList.contains('hidden')) {
    fetchAndRenderLyrics(track);
  }

  if (fullscreenPlayer && fullscreenPlayer.classList.contains('lyrics-active')) {
    fetchAndRenderFullscreenLyrics(track);
  }
}

function setTrackInfo(track) {
  if (playerTitle) playerTitle.textContent = track.name || 'Unknown Track';
  if (playerArtist) playerArtist.textContent = track.artist || 'Unknown Artist';
  if (playerThumb && track.thumbnail) {
    playerThumb.src = upgradeThumbToHD(track.thumbnail);
  }
  const isLiked = isSongLiked(track.videoId || track.name);
  if (playerLikeBtn) {
    playerLikeBtn.classList.toggle('active', isLiked);
    playerLikeBtn.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
  }

  updateMediaSessionMetadata(track);
  syncFullscreenUI();
  updateEasyModeTrackInfo(track);
}

async function playNextTrack() {
  if (!currentPlaylist.length) return;
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
  } else {
    currentTrackIndex++;
  }

  if (currentTrackIndex >= currentPlaylist.length) {
    if (currentTrack && currentTrack.videoId) {
      try {
        const res = await fetch(`${API_BASE}/api/upnext/${currentTrack.videoId}`);
        const upNextData = await res.json();
        if (Array.isArray(upNextData) && upNextData.length) {
          const formattedUpNext = upNextData.map(s => ({
            videoId: s.videoId,
            name: s.title || s.name,
            artist: s.artist?.name || s.artist || 'Unknown',
            album: s.album?.name || '',
            thumbnail: s.thumbnail || s.thumbnails?.[0]?.url || FALLBACK_THUMB,
            duration: s.duration || s.duration_seconds || 200
          }));
          currentPlaylist = currentPlaylist.concat(formattedUpNext);
          playTrack(currentPlaylist[currentTrackIndex], currentPlaylist);
          return;
        }
      } catch (e) {}
    }
    currentTrackIndex = 0;
  }

  playTrack(currentPlaylist[currentTrackIndex], currentPlaylist);
}

function playPrevTrack() {
  if (!currentPlaylist.length) return;
  currentTrackIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  playTrack(currentPlaylist[currentTrackIndex], currentPlaylist);
}

function updateActiveRowVisuals() {
  if (!currentTrack) {
    $$('.track-row').forEach(row => row.classList.remove('is-playing'));
    return;
  }

  $$('.track-row').forEach(row => {
    const rowVideoId = row.dataset.videoid;
    const rowSongName = row.dataset.song;

    let isThisPlaying = false;
    if (currentTrack.videoId && rowVideoId) {
      isThisPlaying = (rowVideoId === currentTrack.videoId);
    } else if (currentTrack.name && rowSongName) {
      isThisPlaying = (rowSongName.trim().toLowerCase() === currentTrack.name.trim().toLowerCase());
    }

    row.classList.toggle('is-playing', isThisPlaying);

    const numEl = row.querySelector('.track-num');
    if (numEl) {
      if (isThisPlaying) {
        numEl.innerHTML = `<span class="playing-orange-dot">•</span>`;
      } else {
        numEl.textContent = row.dataset.idx || numEl.dataset.originalIdx || '01';
      }
    }
  });
}

function setupAllAppInteractions() {
  const heroPlayBtn = $('heroPlayBtn');
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      fetchAndPlaySearch(heroPlayBtn.dataset.song || 'Tide Lines Mara Vale');
    });
  }

  const heroExploreMoodsBtn = $('heroExploreMoodsBtn');
  if (heroExploreMoodsBtn) {
    heroExploreMoodsBtn.addEventListener('click', () => {
      switchView('search');
    });
  }

  $$('.deck-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const query = btn.dataset.song || 'Tide Lines Mara Vale';
      fetchAndPlaySearch(query);
    });
  });

  $$('.mood-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.mood-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const mood = chip.dataset.mood;
      if (mood === 'All') {
        fetchAndPlaySearch('Mara Vale Tide Lines');
      } else {
        fetchAndPlaySearch(`${mood} chill music`);
      }
    });
  });

  $$('.album-card-modern, .album-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) return;
      const query = card.dataset.query;
      if (query) fetchAndPlaySearch(query);
    });
  });

  $$('.play-circle-bubble').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('[data-query]');
      if (parentCard && parentCard.dataset.query) {
        fetchAndPlaySearch(parentCard.dataset.query);
      }
    });
  });

  $$('.track-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) return;
      const songQuery = row.dataset.song;
      if (songQuery) fetchAndPlaySearch(songQuery);
    });
  });

  $$('.artist-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      if (query) fetchAndPlaySearch(query);
    });
  });

  $$('.playlist-card[data-query]').forEach(card => {
    card.addEventListener('click', () => {
      const query = card.dataset.query;
      if (query) fetchAndPlaySearch(query);
    });
  });

  const homeViewPlaylistsLink = $('homeViewPlaylistsLink');
  if (homeViewPlaylistsLink) {
    homeViewPlaylistsLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('playlists');
    });
  }

  const seeAllSongs = document.querySelector('.see-all-songs');
  if (seeAllSongs) {
    seeAllSongs.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('search');
      const chip = document.querySelector('.chip-btn[data-filter="songs"]');
      if (chip) chip.click();
    });
  }

  const seeAllArtists = document.querySelector('.see-all-artists');
  if (seeAllArtists) {
    seeAllArtists.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('search');
      const chip = document.querySelector('.chip-btn[data-filter="artists"]');
      if (chip) chip.click();
    });
  }

  const seeAllAlbums = document.querySelectorAll('.see-all-albums');
  seeAllAlbums.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('search');
      const chip = document.querySelector('.chip-btn[data-filter="albums"]');
      if (chip) chip.click();
    });
  });

  const seeAllPlaylists = document.querySelector('.see-all-playlists');
  if (seeAllPlaylists) {
    seeAllPlaylists.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('search');
      const chip = document.querySelector('.chip-btn[data-filter="playlists"]');
      if (chip) chip.click();
    });
  }

  const openQueueLink = document.querySelector('.open-queue-link');
  if (openQueueLink) {
    openQueueLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('library');
    });
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', () => {
      switchView('made-for-you');
    });
  }

  $$('.like-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const active = btn.classList.contains('active');
      btn.innerHTML = active ? HEART_FILLED : HEART_OUTLINE;
      showToast(active ? 'Added to Liked Songs' : 'Removed from Liked Songs');
    });
  });
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
      suggestionDebounceTimer = setTimeout(() => fetchSearchSuggestions(q, isTopbar), 200);
    } else {
      hideSuggestions();
    }

    clearTimeout(searchDebounceTimer);
    if (!q) {
      showSearchBrowseState();
    } else {
      searchDebounceTimer = setTimeout(() => {
        executeSearch(q, currentFilter);
      }, 350);
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

    dropdown.innerHTML = '';
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
      dropdown.appendChild(item);
    });

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

  if (searchResultsStatus) searchResultsStatus.textContent = `Searching for "${query}"...`;
  
  if (topResultContainer) topResultContainer.classList.add('hidden');
  if (searchSongsBlock) searchSongsBlock.classList.add('hidden');
  if (searchArtistsBlock) searchArtistsBlock.classList.add('hidden');
  if (searchAlbumsBlock) searchAlbumsBlock.classList.add('hidden');
  if (searchPlaylistsBlock) searchPlaylistsBlock.classList.add('hidden');

  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&type=${filter}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Search request failed');

    if (filter === 'all') {
      renderSearchAllResults(data, query);
    } else if (filter === 'songs') {
      renderSongsSection(data);
      if (searchResultsStatus) searchResultsStatus.textContent = `${data.length} songs found for "${query}"`;
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

function renderSearchAllResults(data, query) {
  const { topResult, songs = [], artists = [], albums = [], playlists = [] } = data;
  
  const totalCount = songs.length + artists.length + albums.length + playlists.length;
  if (!totalCount) {
    if (searchResultsStatus) searchResultsStatus.textContent = `No results found for "${query}".`;
    return;
  }

  if (searchResultsStatus) searchResultsStatus.textContent = `Results for "${query}"`;

  if (topResult) {
    renderTopResultCard(topResult);
  }
  if (songs.length) {
    renderSongsSection(songs);
  }
  if (artists.length) {
    renderArtistsSection(artists);
  }
  if (albums.length) {
    renderAlbumsSection(albums);
  }
  if (playlists.length) {
    renderPlaylistsSection(playlists);
  }
}

function renderTopResultCard(top) {
  if (!topResultContainer || !topResultCard) return;
  topResultContainer.classList.remove('hidden');
  const isArtist = top.type === 'artist' || top.artistId;
  const thumb = top.thumbnail || FALLBACK_THUMB;
  const typeText = top.type ? top.type.toUpperCase() : 'TOP RESULT';

  topResultCard.innerHTML = `
    <img class="top-result-thumb ${isArtist ? 'is-artist' : ''}" src="${thumb}" alt="${escapeHtml(top.name)}" />
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
    if (top.type === 'artist' && top.artistId) {
      openArtistDetails(top.artistId, top.name, thumb);
    } else if (top.type === 'album' && top.albumId) {
      openAlbumDetails(top.albumId, top.name, top.artist, thumb);
    } else {
      playTrack(top);
    }
  };
}

function renderSongsSection(songs) {
  if (!searchSongsBlock || !searchResultsList) return;
  searchSongsBlock.classList.remove('hidden');
  if (songsCountBadge) songsCountBadge.textContent = `${songs.length} tracks`;
  searchResultsList.innerHTML = '';
  currentPlaylist = songs;

  songs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');

    const isLiked = isSongLiked(song.videoId);

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" src="${song.thumbnail || FALLBACK_THUMB}" alt="${escapeHtml(song.name)}" />
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

    searchResultsList.appendChild(row);
  });
}

function renderArtistsSection(artists) {
  if (!searchArtistsBlock || !searchArtistsGrid) return;
  searchArtistsBlock.classList.remove('hidden');
  searchArtistsGrid.innerHTML = '';

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

    searchArtistsGrid.appendChild(card);
  });
}

function renderAlbumsSection(albums) {
  if (!searchAlbumsBlock || !searchAlbumsGrid) return;
  searchAlbumsBlock.classList.remove('hidden');
  searchAlbumsGrid.innerHTML = '';

  albums.forEach(album => {
    const card = document.createElement('div');
    card.className = 'album-card';
    const thumb = album.thumbnail || FALLBACK_THUMB;
    card.innerHTML = `
      <div class="album-art-wrap">
        <img class="album-cover-img" src="${thumb}" alt="${escapeHtml(album.name)}" />
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
      if (album.albumId) {
        openAlbumDetails(album.albumId, album.name, album.artist, thumb);
      } else {
        executeSearch(`${album.name} ${album.artist || ''}`, 'songs');
      }
    });

    searchAlbumsGrid.appendChild(card);
  });
}

function renderPlaylistsSection(playlists) {
  if (!searchPlaylistsBlock || !searchPlaylistsGrid) return;
  searchPlaylistsBlock.classList.remove('hidden');
  searchPlaylistsGrid.innerHTML = '';

  playlists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
      <div class="playlist-grid-4">
        <img src="${pl.thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80'}" alt="${escapeHtml(pl.name)}" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">${escapeHtml(pl.name)}</h3>
        <p class="playlist-desc">By ${escapeHtml(pl.author || 'YT Music')}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (pl.playlistId) {
        openPlaylistDetails(pl.playlistId, pl.name, pl.author, pl.thumbnail);
      } else {
        executeSearch(pl.name, 'songs');
      }
    });

    searchPlaylistsGrid.appendChild(card);
  });
}

async function openArtistDetails(artistId, name, thumbnail) {
  if (searchResultsWrapper) searchResultsWrapper.classList.add('hidden');
  if (searchDetailView) searchDetailView.classList.remove('hidden');

  if (detailHeader) {
    detailHeader.innerHTML = `
      <img class="detail-cover is-artist" src="${thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(name)}" />
      <div class="detail-info">
        <span class="detail-type">ARTIST</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">Popular tracks</p>
      </div>
    `;
  }

  if (detailTrackList) {
    detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading artist tracks...</div>';
  }

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
      <img class="detail-cover" src="${thumbnail || FALLBACK_THUMB}" alt="${escapeHtml(name)}" />
      <div class="detail-info">
        <span class="detail-type">ALBUM</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">By ${escapeHtml(artist || 'Various Artists')}</p>
      </div>
    `;
  }

  if (detailTrackList) {
    detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading album tracks...</div>';
  }

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
      <img class="detail-cover" src="${thumbnail || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(name)}" />
      <div class="detail-info">
        <span class="detail-type">PLAYLIST</span>
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <p class="detail-sub">Curated by ${escapeHtml(author || 'YT Music')}</p>
      </div>
    `;
  }

  if (detailTrackList) {
    detailTrackList.innerHTML = '<div style="padding: 20px; color: var(--text-muted);">Loading playlist tracks...</div>';
  }

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
  detailTrackList.innerHTML = '';
  songs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');

    const isLiked = isSongLiked(song.videoId);

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" src="${song.thumbnail || FALLBACK_THUMB}" alt="${escapeHtml(song.name)}" />
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

    detailTrackList.appendChild(row);
  });
}

async function fetchAndPlaySearch(query) {
  let q = (query || '').trim();
  if (!q) return;

  q = q.replace(/[\(\[\{].*?[\)\]\}]/g, '').replace(/["']/g, '').trim();

  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}&type=songs`);
    const data = await res.json();
    const songs = Array.isArray(data) ? data : (data.songs || []);
    
    if (songs && songs.length) {
      const target = songs[0];
      const videoId = target.videoId || (typeof target.id === 'object' ? target.id.videoId : target.id);
      playTrack({
        ...target,
        videoId: videoId
      }, songs);
    } else {
      showToast(`No results for "${q}"`);
    }
  } catch (e) {
    console.error('Play search error:', e);
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
  likedSongsList.innerHTML = '';

  if (!likedSongs.length) {
    likedSongsList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">No liked songs yet. Click the heart icon on any track to save it here.</div>';
    return;
  }

  likedSongs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" src="${song.thumbnail || FALLBACK_THUMB}" alt="${escapeHtml(song.name)}" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(song.name)}</span>
        <span class="track-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(song.album || '')}</span>
      <span class="track-time">${formatTime(song.duration || song.duration_seconds || song.length)}</span>
      <button class="like-heart-btn active">${HEART_FILLED}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(song);
        return;
      }
      playTrack(song, likedSongs);
    });

    likedSongsList.appendChild(row);
  });
}

function renderLibraryView(tab = 'songs') {
  if (!libraryTrackList) return;
  libraryTrackList.innerHTML = '';

  if (tab === 'songs') {
    renderLikedSongsViewIntoLibrary();
  } else if (tab === 'albums') {
    libraryTrackList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">Saved albums will appear here.</div>';
  } else if (tab === 'artists') {
    libraryTrackList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">Followed artists will appear here.</div>';
  } else if (tab === 'playlists') {
    libraryTrackList.innerHTML = '<div style="padding: 24px 0; color: var(--text-muted);">Your custom playlists will appear here.</div>';
  }
}

function renderLikedSongsViewIntoLibrary() {
  if (!likedSongs.length) {
    libraryTrackList.innerHTML = `
      <div class="track-row" data-song="Night Swimmer Mara Vale">
        <span class="track-num">01</span>
        <img class="track-thumb" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=80&q=80" alt="Thumb" />
        <div class="track-details">
          <span class="track-name">Night Swimmer</span>
          <span class="track-artist">Mara Vale</span>
        </div>
        <span class="track-album">Tide Lines</span>
        <span class="track-time">4:18</span>
        <button class="like-heart-btn active">${HEART_FILLED}</button>
      </div>
      <div class="track-row" data-song="Refraction Cleo North">
        <span class="track-num">02</span>
        <img class="track-thumb" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80" alt="Thumb" />
        <div class="track-details">
          <span class="track-name">Refraction</span>
          <span class="track-artist">Cleo North</span>
        </div>
        <span class="track-album">Glass Hours</span>
        <span class="track-time">5:12</span>
        <button class="like-heart-btn active">${HEART_FILLED}</button>
      </div>
    `;
    setupAllAppInteractions();
    return;
  }

  likedSongs.forEach((song, idx) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.dataset.videoid = song.videoId;
    row.dataset.idx = (idx + 1).toString().padStart(2, '0');

    row.innerHTML = `
      <span class="track-num" data-original-idx="${(idx + 1).toString().padStart(2, '0')}">${(idx + 1).toString().padStart(2, '0')}</span>
      <img class="track-thumb" src="${song.thumbnail || FALLBACK_THUMB}" alt="${escapeHtml(song.name)}" />
      <div class="track-details">
        <span class="track-name">${escapeHtml(song.name)}</span>
        <span class="track-artist">${escapeHtml(song.artist)}</span>
      </div>
      <span class="track-album">${escapeHtml(song.album || '')}</span>
      <span class="track-time">${formatTime(song.duration || song.duration_seconds || song.length)}</span>
      <button class="like-heart-btn active">${HEART_FILLED}</button>
    `;

    row.addEventListener('click', (e) => {
      if (e.target.closest('.like-heart-btn')) {
        toggleLikeSong(song);
        renderLibraryView('songs');
        return;
      }
      playTrack(song, likedSongs);
    });

    libraryTrackList.appendChild(row);
  });
}

function setupPlaylistsModal() {
  if (newPlaylistBtn) {
    newPlaylistBtn.addEventListener('click', () => createPlaylistModal.classList.remove('hidden'));
  }
  if (makeRoomCard) {
    makeRoomCard.addEventListener('click', () => createPlaylistModal.classList.remove('hidden'));
  }
  if (cancelPlaylistBtn) {
    cancelPlaylistBtn.addEventListener('click', () => createPlaylistModal.classList.add('hidden'));
  }

  if (confirmPlaylistBtn) {
    confirmPlaylistBtn.addEventListener('click', () => {
      const name = newPlaylistNameInput.value.trim();
      const desc = newPlaylistDescInput.value.trim() || 'Custom playlist';
      if (!name) {
        showToast('Enter a playlist name');
        return;
      }

      const newPl = { id: 'pl_' + Date.now(), name, desc, tracks: [] };
      customPlaylists.push(newPl);
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
  
  playlistsGrid.innerHTML = `
    <div class="playlist-card" data-query="Late Shift">
      <div class="playlist-grid-4">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" alt="art" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">Late Shift</h3>
        <p class="playlist-desc">A little warmth for the walk home.</p>
      </div>
    </div>
    <div class="playlist-card" data-query="Soft Focus">
      <div class="playlist-grid-4">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" alt="art" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">Soft Focus</h3>
        <p class="playlist-desc">For the hours that blur at the edges.</p>
      </div>
    </div>
    <div class="playlist-card" data-query="Now in Sonora">
      <div class="playlist-grid-4">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80" alt="art" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80" alt="art" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">Now in Sonora</h3>
        <p class="playlist-desc">The records we keep coming back to.</p>
      </div>
    </div>
  `;

  customPlaylists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
      <div class="playlist-grid-4">
        <img src="${FALLBACK_THUMB}" alt="${escapeHtml(pl.name)}" />
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" alt="${escapeHtml(pl.name)}" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=150&q=80" alt="${escapeHtml(pl.name)}" />
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" alt="${escapeHtml(pl.name)}" />
      </div>
      <div class="playlist-info">
        <h3 class="playlist-name">${escapeHtml(pl.name)}</h3>
        <p class="playlist-desc">${escapeHtml(pl.desc)}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      if (pl.tracks && pl.tracks.length) {
        playTrack(pl.tracks[0], pl.tracks);
      } else {
        showToast(`Playlist "${pl.name}" is empty`);
      }
    });

    playlistsGrid.appendChild(card);
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
  playlistsGrid.appendChild(createCard);
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
    const res = await fetch(`${API_BASE}/api/lyrics/${track.videoId || 'unknown'}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
    const data = await res.json();
    const lines = data.lines;

    if (Array.isArray(lines) && lines.length) {
      if (lyricsContent) {
        lyricsContent.innerHTML = '';
        lines.forEach(lineObj => {
          const p = document.createElement('p');
          p.className = 'lyrics-line';
          p.textContent = typeof lineObj === 'string' ? lineObj : (lineObj.text || '');
          lyricsContent.appendChild(p);
        });
      }
    } else {
      if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics not available for this song.</p>';
    }
  } catch (e) {
    if (lyricsContent) lyricsContent.innerHTML = '<p class="lyrics-placeholder">Unable to load lyrics at this time.</p>';
  }
}

let activeSyncedLyrics = null;
let currentActiveLyricIndex = -1;

function syncFullscreenLyricsProgress(currentTime) {
  if (!activeSyncedLyrics || !activeSyncedLyrics.length) return;
  const fsLyricsContent = $('fsLyricsContent');
  if (!fsLyricsContent) return;

  let activeIdx = -1;
  for (let i = 0; i < activeSyncedLyrics.length; i++) {
    if (currentTime >= activeSyncedLyrics[i].time) {
      activeIdx = i;
    } else {
      break;
    }
  }

  if (activeIdx >= 0 && activeIdx !== currentActiveLyricIndex) {
    currentActiveLyricIndex = activeIdx;
    const lines = fsLyricsContent.querySelectorAll('.fs-lyrics-line');
    lines.forEach((lineEl, idx) => {
      if (idx === activeIdx) {
        lineEl.classList.add('active');
        const targetTop = lineEl.offsetTop - fsLyricsContent.offsetTop - (fsLyricsContent.clientHeight / 2) + (lineEl.clientHeight / 2);
        fsLyricsContent.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      } else {
        lineEl.classList.remove('active');
      }
    });
  }
}

async function fetchAndRenderFullscreenLyrics(track) {
  const fsLyricsContent = $('fsLyricsContent');
  if (!fsLyricsContent) return;
  fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Fetching lyrics...</p>';
  activeSyncedLyrics = null;
  currentActiveLyricIndex = -1;

  if (!track || (!track.videoId && !track.name)) {
    fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics unavailable for this track.</p>';
    return;
  }

  try {
    const title = track.name || '';
    const artist = track.artist || '';
    const res = await fetch(`${API_BASE}/api/lyrics/${track.videoId || 'unknown'}?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`);
    const data = await res.json();

    if (data.synced && Array.isArray(data.lines) && data.lines.length) {
      activeSyncedLyrics = data.lines;
      fsLyricsContent.innerHTML = '';
      data.lines.forEach((lineObj, i) => {
        const p = document.createElement('p');
        p.className = 'fs-lyrics-line';
        p.dataset.time = lineObj.time;
        if (i === 0) p.classList.add('active');
        p.textContent = lineObj.text;
        p.addEventListener('click', () => {
          if (ytPlayer && isPlayerReady) {
            ytPlayer.seekTo(lineObj.time, true);
          }
        });
        fsLyricsContent.appendChild(p);
      });
    } else if (Array.isArray(data.lines) && data.lines.length) {
      fsLyricsContent.innerHTML = '';
      data.lines.forEach((line, i) => {
        const p = document.createElement('p');
        p.className = 'fs-lyrics-line';
        if (i === 0) p.classList.add('active');
        p.textContent = typeof line === 'string' ? line : (line.text || '');
        fsLyricsContent.appendChild(p);
      });
    } else {
      fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Lyrics not available for this song.</p>';
    }
  } catch (e) {
    fsLyricsContent.innerHTML = '<p class="lyrics-placeholder">Unable to load lyrics at this time.</p>';
  }
}

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ==========================================================================
   ✨ EASY MODE FULLSCREEN LOGIC & CONTROLS
   ========================================================================== */

const homeEasyModeBtn = $('homeEasyModeBtn');
const heroEasyModeBtn = $('heroEasyModeBtn');
const bannerEasyModeBtn = $('bannerEasyModeBtn');
const sidebarEasyModeBtn = $('sidebarEasyModeBtn');
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

let isEasyMode = false;
let isDraggingEasySeek = false;

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

  const hdArt = upgradeThumbToHD(trackToUse.thumbnail || FALLBACK_THUMB);
  if (easyBgArt) easyBgArt.src = hdArt;
  if (easyTrackThumb) easyTrackThumb.src = hdArt;

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
  } else {
    if (easyCurTime) easyCurTime.textContent = '0:00';
    if (easyDurTime) easyDurTime.textContent = formatTime(trackToUse.duration || 0);
    if (easySeekInput) {
      easySeekInput.max = trackToUse.duration || 100;
      easySeekInput.value = 0;
    }
    if (easyProgressFill) easyProgressFill.style.width = '0%';
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
      if (!currentTrack) return;
      toggleLikeSong(currentTrack);
      const isLiked = isSongLiked(currentTrack.videoId || currentTrack.name);
      easyLikeBtn.classList.toggle('active', isLiked);
      if (easyLikeIcon) easyLikeIcon.innerHTML = isLiked ? HEART_FILLED : HEART_OUTLINE;
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
      if (ytPlayer && isPlayerReady) {
        ytPlayer.seekTo(parseFloat(easySeekInput.value), true);
      }
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
      easyDebounceTimer = setTimeout(() => executeEasySearch(query), 300);
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
    easySearchResults.innerHTML = '';
    songs.slice(0, 6).forEach(s => {
      const item = document.createElement('div');
      item.className = 'easy-search-item';
      item.innerHTML = `
        <img class="easy-search-thumb" src="${s.thumbnail || FALLBACK_THUMB}" alt="" />
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
      easySearchResults.appendChild(item);
    });
  } catch (e) {
    easySearchResults.innerHTML = '<div style="padding:12px;color:rgba(255,255,255,0.6);text-align:center;">Search failed</div>';
  }
}

/* ==========================================================================
   🎵 USER LISTENING HISTORY CACHE & DYNAMIC RECOMMENDATIONS ENGINE
   ========================================================================== */

const MAX_HISTORY_ITEMS = 15;
let userHistory = JSON.parse(localStorage.getItem('sonora_user_history') || '[]');

const MAX_RECENT_SEARCHES = 10;
let recentSearches = JSON.parse(localStorage.getItem('sonora_recent_searches') || '[]');

function addRecentSearch(query) {
  const q = (query || '').trim();
  if (!q) return;
  recentSearches = recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase());
  recentSearches.unshift(q);
  if (recentSearches.length > MAX_RECENT_SEARCHES) {
    recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
  }
  try {
    localStorage.setItem('sonora_recent_searches', JSON.stringify(recentSearches));
  } catch (e) {}
  renderRecentSearches();
}

function removeRecentSearch(query) {
  recentSearches = recentSearches.filter(s => s !== query);
  try {
    localStorage.setItem('sonora_recent_searches', JSON.stringify(recentSearches));
  } catch (e) {}
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
  row.innerHTML = '';

  const label = document.createElement('span');
  label.className = 'recent-searches-label';
  label.textContent = 'Recent';
  row.appendChild(label);

  recentSearches.forEach(q => {
    const chip = document.createElement('div');
    chip.className = 'recent-search-chip';
    chip.innerHTML = `
      <span class="recent-search-text">${escapeHtml(q)}</span>
      <button class="recent-search-remove" title="Remove from recent searches">&times;</button>
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

    row.appendChild(chip);
  });
}

function recordSongToHistory(track) {
  if (!track || !track.name) return;

  const existingIdx = userHistory.findIndex(h =>
    (track.videoId && h.videoId === track.videoId) ||
    (h.name && h.name.toLowerCase() === track.name.toLowerCase())
  );
  if (existingIdx !== -1) {
    userHistory.splice(existingIdx, 1);
  }

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

  if (userHistory.length > MAX_HISTORY_ITEMS) {
    userHistory = userHistory.slice(0, MAX_HISTORY_ITEMS);
  }

  try {
    localStorage.setItem('sonora_user_history', JSON.stringify(userHistory));
  } catch (e) {}

  if (typeof forYouFeed !== 'undefined' && forYouFeed.initialized) {
    forYouFeed.seedPool.unshift(historyItem);
  }
}

async function renderPersonalizedHomeFeed() {
  const recEyebrow = $('homeRecEyebrow');
  const recTitle = $('homeRecTitle');
  const homeTrackList = $('homeTrackList');
  const curatedEyebrow = $('homeCuratedEyebrow');
  const curatedTitle = $('homeCuratedTitle');
  const homeAlbumsGrid = $('homeAlbumsGrid');

  if (!homeTrackList) return;

  // 1. FIRST TIME USER: Load instant global mix
  if (!userHistory || userHistory.length === 0) {
    if (recEyebrow) recEyebrow.textContent = 'MIXED COUNTRY SELECTION';
    if (recTitle) recTitle.textContent = 'Top Global & Regional Hits';
    if (curatedEyebrow) curatedEyebrow.textContent = 'GLOBAL MIX';
    if (curatedTitle) curatedTitle.textContent = 'Trending Hits Across Regions';

    try {
      const res = await fetch(`${API_BASE}/api/global-mix`);
      const data = await res.json();
      const rawTracks = Array.isArray(data) ? data : (data.tracks || data.songs || []);
      
      if (rawTracks.length) {
        const formatted = rawTracks.map(s => ({
          videoId: s.videoId || (typeof s.id === 'object' ? s.id.videoId : s.id) || '',
          name: s.name || s.title || 'Untitled Track',
          artist: s.artist?.name || s.artist || 'Various Artists',
          album: s.album?.name || s.album || 'Single',
          thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
          duration: s.duration || s.duration_seconds || s.length || 200
        }));

        renderTrackRows(homeTrackList, formatted.slice(0, 10));
        if (homeAlbumsGrid) renderAlbumCards(homeAlbumsGrid, formatted.slice(0, 6));
        lastRecommendedTracks = formatted.slice(0, 10);
        renderSearchBrowseSuggestions();
      }
    } catch (e) {
      console.error('Failed to load global mix:', e);
    }
    return;
  }

  // 2. RETURNING USER: Taste Pool (Liked songs + History)
  const tastePool = [];
  const tasteSeen = new Set();
  
  [...likedSongs, ...userHistory].forEach(t => {
    const key = t.videoId || t.name;
    if (key && !tasteSeen.has(key)) {
      tasteSeen.add(key);
      tastePool.push(t);
    }
  });

  const seedTrack = tastePool[Math.floor(Math.random() * Math.min(tastePool.length, 6))] || userHistory[0];
  
  const validArtist = (seedTrack.artist && 
                       seedTrack.artist.toLowerCase() !== 'unknown' && 
                       seedTrack.artist.toLowerCase() !== 'unknown artist') 
                      ? seedTrack.artist 
                      : null;

  if (recEyebrow) recEyebrow.textContent = 'BASED ON YOUR TASTE';
  if (recTitle) {
    recTitle.textContent = seedTrack.name 
      ? `Because you listened to ${seedTrack.name}` 
      : 'Top Picks For You';
  }

  if (curatedEyebrow) curatedEyebrow.textContent = 'RECOMMENDED FOR YOU';
  if (curatedTitle) {
    curatedTitle.textContent = validArtist 
      ? `More songs like ${validArtist}` 
      : 'Fresh Recommendations For You';
  }

  // Instant local cache render
  const shuffledPool = shuffleArray(tastePool.slice(0, 15));
  renderTrackRows(homeTrackList, shuffledPool.slice(0, 10));
  if (homeAlbumsGrid) renderAlbumCards(homeAlbumsGrid, shuffledPool.slice(0, 6));
  lastRecommendedTracks = shuffledPool.slice(0, 10);
  renderSearchBrowseSuggestions();

  // 3. Dynamic background fetch for related tracks
  (async () => {
    try {
      let recTracks = [];
      if (seedTrack.videoId) {
        const res = await fetch(`${API_BASE}/api/upnext/${seedTrack.videoId}`);
        recTracks = await res.json();
      }

      const tracksList = Array.isArray(recTracks) ? recTracks : (recTracks.tracks || recTracks.songs || []);

      if (tracksList.length >= 4) {
        const formatted = tracksList.map(s => ({
          videoId: s.videoId || (typeof s.id === 'object' ? s.id.videoId : s.id) || '',
          name: s.name || s.title || 'Untitled Track',
          artist: s.artist?.name || s.artist || 'Various Artists',
          album: s.album?.name || s.album || 'Single',
          thumbnail: s.thumbnail || (s.thumbnails && s.thumbnails[0] ? s.thumbnails[0].url : FALLBACK_THUMB),
          duration: s.duration || s.duration_seconds || s.length || 200
        }));

        renderTrackRows(homeTrackList, formatted.slice(0, 10));
        if (homeAlbumsGrid) renderAlbumCards(homeAlbumsGrid, formatted.slice(0, 6));
        lastRecommendedTracks = formatted.slice(0, 10);
        renderSearchBrowseSuggestions();
      }
    } catch (e) {
      console.warn('Background recommendations fetch failed:', e);
    }
  })();
}

async function renderSearchBrowseSuggestions() {
  const songsList = $('searchBrowseSongsList');
  const albumsGrid = $('searchBrowseAlbumsGrid');
  const songsTitle = $('searchBrowseSongsTitle');
  const albumsTitle = $('searchBrowseAlbumsTitle');
  if (!songsList) return;

  if (lastRecommendedTracks.length) {
    if (songsTitle) songsTitle.textContent = userHistory.length ? 'Recommended for you' : 'Songs';
    if (albumsTitle) albumsTitle.textContent = userHistory.length ? 'Picked for you' : 'Albums';
    renderTrackRows(songsList, lastRecommendedTracks);
    if (albumsGrid) renderAlbumCards(albumsGrid, lastRecommendedTracks.slice(0, 5));
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/global-mix`);
    const tracks = await res.json();
    if (Array.isArray(tracks) && tracks.length) {
      renderTrackRows(songsList, tracks.slice(0, 10));
      if (albumsGrid) renderAlbumCards(albumsGrid, tracks.slice(0, 5));
    }
  } catch (e) {}
}

function renderTrackRows(container, tracks) {
  if (!container || !Array.isArray(tracks)) return;
  container.innerHTML = '';
  tracks.forEach((t, i) => {
    const isCurPlaying = currentTrack && ((currentTrack.videoId && currentTrack.videoId === t.videoId) || (currentTrack.name === t.name));
    const num = (i + 1).toString().padStart(2, '0');
    const isLiked = isSongLiked(t.videoId || t.name);

    const row = document.createElement('div');
    row.className = `track-row ${isCurPlaying ? 'is-playing' : ''}`;
    row.innerHTML = `
      <span class="track-num">${isCurPlaying ? '<span class="playing-orange-dot">•</span>' : num}</span>
      <img class="track-thumb" width="38" height="38" src="${t.thumbnail || FALLBACK_THUMB}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
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

    container.appendChild(row);
  });
}

function renderAlbumCards(container, tracks) {
  if (!container || !Array.isArray(tracks) || !tracks.length) return;
  container.innerHTML = '';
  tracks.forEach(t => {
    const isLiked = isSongLiked(t.videoId || t.name);
    const card = document.createElement('div');
    card.className = 'album-card-modern';
    card.innerHTML = `
      <div class="art-container">
        <img width="400" height="400" src="${t.thumbnail || FALLBACK_THUMB}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
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

    container.appendChild(card);
  });
}

/* ==========================================================================
   🔁 "MADE FOR YOU" — INFINITE PERSONALIZED SCROLL FEED
   ========================================================================== */

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

function buildForYouSeedPool() {
  const pool = [];
  const seen = new Set();
  [...likedSongs, ...userHistory].forEach(t => {
    const key = t.videoId || t.name;
    if (key && !seen.has(key)) {
      seen.add(key);
      pool.push(t);
    }
  });
  return shuffleArray(pool);
}

function appendTrackRows(container, tracks) {
  if (!container || !Array.isArray(tracks) || !tracks.length) return;
  tracks.forEach(t => {
    const key = t.videoId || t.name;
    if (!key || forYouFeed.shownIds.has(key)) return;
    forYouFeed.shownIds.add(key);

    const isCurPlaying = currentTrack && ((currentTrack.videoId && currentTrack.videoId === t.videoId) || (currentTrack.name === t.name));
    const isLiked = isSongLiked(t.videoId || t.name);
    const num = forYouFeed.shownIds.size.toString().padStart(2, '0');

    const row = document.createElement('div');
    row.className = `track-row ${isCurPlaying ? 'is-playing' : ''}`;
    row.innerHTML = `
      <span class="track-num">${isCurPlaying ? '<span class="playing-orange-dot">•</span>' : num}</span>
      <img class="track-thumb" width="38" height="38" src="${t.thumbnail || FALLBACK_THUMB}" alt="" onerror="this.onerror=null;this.src='${FALLBACK_THUMB}';" />
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
        if (nowLiked) forYouFeed.seedPool.unshift(t);
        return;
      }
      playTrack(t, tracks);
    });

    container.appendChild(row);
  });
}

async function loadMoreForYouTracks() {
  if (forYouFeed.loading || forYouFeed.exhausted) return;
  const container = $('madeForYouList');
  if (!container) return;

  forYouFeed.loading = true;
  const loadingEl = document.createElement('div');
  loadingEl.className = 'for-you-loading';
  loadingEl.textContent = 'Finding more for you…';
  loadingEl.style.cssText = 'padding:20px 0;text-align:center;color:rgba(255,255,255,0.5);font-size:13px;';
  container.appendChild(loadingEl);

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
            duration: s.duration || s.duration_seconds || s.length || 200
          }));
        }
      }
    }

    if (batch.length < 6) {
      const res = await fetch(`${API_BASE}/api/global-mix`);
      const globalTracks = await res.json();
      if (Array.isArray(globalTracks)) {
        batch = batch.concat(shuffleArray(globalTracks));
      }
    }

    const freshTracks = batch.filter(t => {
      const key = t.videoId || t.name;
      return key && !forYouFeed.shownIds.has(key);
    });

    if (!freshTracks.length) {
      forYouFeed.exhausted = true;
    } else {
      appendTrackRows(container, freshTracks.slice(0, 10));
    }
  } catch (e) {
  } finally {
    loadingEl.remove();
    forYouFeed.loading = false;
  }
}

function initForYouFeed() {
  const container = $('madeForYouList');
  if (!container || forYouFeed.initialized) return;

  forYouFeed.initialized = true;
  forYouFeed.seedPool = buildForYouSeedPool();

  const sentinel = document.createElement('div');
  sentinel.id = 'forYouScrollSentinel';
  sentinel.style.cssText = 'height:1px;';
  container.after(sentinel);

  const scrollRoot = document.getElementById('contentBody') || null;
  forYouFeed.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) loadMoreForYouTracks();
    });
  }, { root: scrollRoot, rootMargin: '400px' });
  forYouFeed.observer.observe(sentinel);

  loadMoreForYouTracks().then(() => loadMoreForYouTracks());
}

/* ==========================================================================
   🔄 REMOTE ADMIN CACHE PURGE LISTENER (FIXED)
   ========================================================================== */
function setupRemoteCachePurgeListener() {
  setInterval(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/check-reset?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();

      if (data && data.reset) {
        const lastAppliedReset = localStorage.getItem('sonora_last_reset_id');
        const currentResetId = String(data.resetId || data.timestamp || 'reset_triggered');

        if (lastAppliedReset === currentResetId && !data.forceAlways) {
          return;
        }

        showToast('Admin reset user cache. Reloading as first-time visitor...');

        userHistory = [];
        likedSongs = [];
        customPlaylists = [];
        recentSearches = [];
        lastRecommendedTracks = [];

        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let reg of registrations) {
              await reg.unregister();
            }
          } catch (e) {}
        }

        if ('caches' in window) {
          try {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          } catch (e) {}
        }

        try {
          sessionStorage.clear();
          localStorage.clear();
        } catch (e) {}

        setTimeout(() => {
          window.location.replace(window.location.origin + '/?fresh=' + Date.now());
        }, 600);
      }
    } catch (e) {}
  }, 8000);
}