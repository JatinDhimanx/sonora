# 🎵 Sonora Music — Ultra-Smooth Music Player App

> **A Quiet, Elegant Music Space for Your Desktop & Mobile**
> Full Background Audio Playback | Synced Auto-Scrolling Lyrics | 120Hz Refresh Rate | Apple Music Fullscreen Design

---

## 📦 GitHub Release & APK Download

[![GitHub Release](https://img.shields.io/badge/Release-v1.0.0-E05D38?style=for-the-badge&logo=github)](https://github.com/JatinDhimanx/sonora/releases/tag/v1.0.0)
[![Download APK](https://img.shields.io/badge/Download-Sonora__v1.0.0.apk-3E85F7?style=for-the-badge&logo=android)](https://github.com/JatinDhimanx/sonora/releases/download/v1.0.0/Sonora-v1.0.0.apk)

### 📲 Download Options

- **📥 Direct APK Download**: [Download `Sonora-v1.0.0.apk`](https://raw.githubusercontent.com/JatinDhimanx/sonora/main/Sonora-v1.0.0.apk)
- **🏷️ GitHub Official Release Page**: [View Release `v1.0.0`](https://github.com/JatinDhimanx/sonora/releases/tag/v1.0.0)

---

## 📱 Android App (APK / PWA) Installation

Sonora is a **Native-Grade Progressive Web Application (PWA)** & Android WebAPK package. You can install it directly on your Android phone as a standalone `.apk` / app with full **Background Screen-Off Music Playback**!

### 🚀 Quick Install Guide (Android & Desktop)

#### **Method 1: Direct APK Download**:
1. Download [**`Sonora-v1.0.0.apk`**](https://raw.githubusercontent.com/JatinDhimanx/sonora/main/Sonora-v1.0.0.apk) or visit [**GitHub Releases**](https://github.com/JatinDhimanx/sonora/releases/tag/v1.0.0).
2. Open the file on your Android phone to install the Sonora App.

#### **Method 2: Android Browser PWA 1-Tap WebAPK**:
1. Open the app link on your phone browser (Chrome / Brave / Edge).
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
├── Sonora-v1.0.0.apk    # Android App Installer Package
├── backend/
│   └── server.js        # Express REST API, LRCLIB Synced Lyrics & Audio Stream Proxy
├── public/
│   ├── index.html       # Responsive UI & PWA Meta Tags
│   ├── style.css        # 120Hz GPU-Accelerated Styles & Fullscreen Redesign
│   ├── script.js        # 120 FPS Progress Loop & MediaSession Background Bridge
│   ├── favicon.svg      # HD Vector App Icon
│   ├── manifest.json   # PWA Web App Manifest
│   ├── sw.js            # Offline Caching Service Worker
│   └── Sonora-v1.0.0.apk# Public Downloadable APK Asset
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
