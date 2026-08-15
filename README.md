# YT Music (Unofficial) — Prototype

Simple prototype jo unofficial `ytmusic-api` npm package use karke YouTube Music search
karta hai aur browser me embedded YouTube player se song play karta hai.

## Folder Structure
```
ytmusic-prototype/
├── backend/
│   ├── package.json
│   └── server.js        # Express server + ytmusic-api wrapper (REST endpoints)
├── public/
│   ├── index.html        # UI
│   ├── style.css         # Styling
│   └── script.js         # Search + play logic (frontend)
└── README.md
```

## Kaise chalayein

1. Backend folder me jao aur dependencies install karo:
   ```bash
   cd backend
   npm install
   ```

2. Server start karo:
   ```bash
   npm start
   ```

3. Browser me kholo:
   ```
   http://localhost:3000
   ```

Backend hi `public/` folder ko serve kar deta hai, isliye alag se frontend server ki zaroorat nahi.

## Kaam kaise karta hai
- `ytmusic-api` (npm package) YouTube Music ke internal/unofficial endpoints scrape karke
  search results deta hai — koi login/cookies chahiye nahi basic search ke liye.
- Backend (`server.js`) is package ko wrap karke apna REST API deta hai:
  - `GET /api/search?q=<query>` → songs ka list
  - `GET /api/song/:id` → ek song ki detail
- Frontend (`script.js`) in endpoints ko `fetch` karta hai aur result list dikhata hai.
- Kisi song pe click karne par YouTube ka official `<iframe>` embed player use hota hai
  playback ke liye (videoId ke through) — ye YouTube ke embed policy ke andar hai.

## Note
- Ye ek **prototype hai**, production use ke liye nahi. Unofficial API kabhi bhi
  break ho sakti hai kyunki ye YouTube ke public API contract ka hissa nahi hai.
- Agar `ytmusic-api` init fail ho, thoda wait karke retry karo ya package version check karo.
