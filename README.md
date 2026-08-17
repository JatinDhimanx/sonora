# 🎵 Sonora Music — Ultra-Smooth Music Web App

> **A Quiet, Elegant Music Space for Your Desktop & Mobile Web**
> Full Background Audio Playback | Synced Auto-Scrolling Lyrics | 120Hz Refresh Rate | Apple Music Fullscreen Design

---

## 🌐 Progressive Web Application (PWA) Installation

Sonora is a **Native-Grade Progressive Web Application (PWA)**. You can install it on your Desktop or Mobile device directly from your browser!

### 🚀 Quick Install Guide

#### **Android / Mobile (Chrome / Brave / Edge)**:
1. Open the website on your phone browser.
2. Tap the **"Add to Home Screen"** or **"Install App"** button.
3. Enjoy **uninterrupted background music playback** with native phone lockscreen controls!

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
│   ├── index.html       # Responsive Web UI & Meta Tags
│   ├── style.css        # 120Hz GPU-Accelerated Styles & Fullscreen Redesign
│   ├── script.js        # 120 FPS Progress Loop & MediaSession Background Bridge
│   ├── favicon.svg      # HD Vector App Icon
│   ├── manifest.json   # PWA Web App Manifest
│   └── sw.js            # Offline Caching Service Worker
├── package.json
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
