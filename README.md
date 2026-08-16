# 🎵 Sonora Music — Ultra-Smooth Music Player App

> **A Quiet, Elegant Music Space for Your Desktop & Mobile**
> Full Background Audio Playback | Synced Auto-Scrolling Lyrics | 120Hz Refresh Rate | Apple Music Fullscreen Design

---

## 📱 Android App (APK / PWA) Installation

Sonora is a **Native-Grade Progressive Web Application (PWA)**. You can install it directly on your Android phone as a standalone `.apk` / app with full **Background Screen-Off Music Playback**!

### 🚀 Quick Install Guide (Android & Desktop)

#### **Android Phone (Chrome / Brave / Edge)**:
1. Open the app link on your phone browser.
2. Tap the **"Add to Home Screen"** or **"Install Sonora"** prompt in your browser menu.
3. Sonora will automatically package and install as a **Native Android App (`Sonora.apk`)** on your home screen!
4. **Background Audio**: Play any track, lock your mobile screen, and enjoy **uninterrupted music playback** with native phone lockscreen controls!

#### **iPhone / iOS (Safari)**:
1. Open in Safari.
2. Tap **Share Button** `[↑]` ➔ Select **"Add to Home Screen"**.

#### **Windows / Mac (Chrome / Edge)**:
1. Click the **Install App `(+)`** icon in your browser address bar.

---

## ✨ Key Features

- **🎧 Uninterrupted Background Playback**: Screen lock hone par bhi music continuous chalta rehta hai real-time backend stream proxy ke saath.
- **🎤 Real-Time Synced Lyrics**: Singer ke saath-saath lyrics auto-scroll hote hain (LRCLIB synced lyrics engine).
- **🎨 Apple Music Fullscreen Redesign**: 2-Column responsive layout (Artwork & Controls on left, Live Synced Lyrics on right).
- **⚡ 120Hz Display Refresh Sync**: `requestAnimationFrame` loop + GPU hardware acceleration for liquid-smooth 120 FPS performance.
- **🖼️ HD Album Artwork**: Auto-upgraded high-definition `512x512` album art.
- **📲 Installable PWA App**: Web App Manifest & Caching Service Worker.

---

## 📂 Project Structure

```
ytmusic-prototype/
├── backend/
│   └── server.js        # Express REST API, LRCLIB Synced Lyrics & Audio Stream Proxy
├── public/
│   ├── index.html       # Responsive UI & PWA Meta Tags
│   ├── style.css        # 120Hz GPU-Accelerated Styles & Fullscreen Redesign
│   ├── script.js        # 120 FPS Progress Loop & MediaSession Background Bridge
│   ├── favicon.svg      # HD Vector App Icon
│   ├── manifest.json   # PWA Web App Manifest
│   └── sw.js            # Offline Caching Service Worker
└── README.md
```

---

## 🛠️ How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Sonora backend server:
   ```bash
   npm start
   ```

3. Open in your browser:
   ```
   http://localhost:3000
   ```
