# Walkthrough - Cloudflare Tunnel & Public Domain Deployment (`vnr202.l4st-r4ven.io.vn`)

Successfully configured Node.js / Express backend (`doi-moi-simulator`), Socket.io CORS rules, dynamic QR code routing, Cloudflare Tunnel ingress rules (`config.yml`), and deployment setup scripts.

## Changes Made

### Node.js & Socket.io Server Updates

#### [server.js](file:///c:/Projects/doi-moi-simulator/server.js)
- **CORS Setup**: Configured Socket.io and Express CORS middleware with an allowed origin list containing `https://vnr202.l4st-r4ven.io.vn`, `http://localhost:3000`, and `http://127.0.0.1:3000`.
- **Dynamic QR Code Join URL**: Updated `host:create_room` handler to dynamically construct player join links matching `https://vnr202.l4st-r4ven.io.vn/player?room={ROOM_CODE}` (or utilizing `process.env.PUBLIC_DOMAIN` / `data.origin`).

#### Client Scripts
- Updated [museum.js](file:///c:/Projects/doi-moi-simulator/public/js/museum.js) and [host.js](file:///c:/Projects/doi-moi-simulator/public/js/host.js) to pass `{ origin: window.location.origin }` when creating room sessions.

---

### Cloudflare Tunnel & Automation Files

#### [config.yml](file:///c:/Projects/doi-moi-simulator/config.yml)
- Created ingress configuration pointing `vnr202.l4st-r4ven.io.vn` to `http://localhost:3000`.

#### Setup Scripts
- Created [setup-tunnel.ps1](file:///c:/Projects/doi-moi-simulator/setup-tunnel.ps1) (PowerShell) and [setup-tunnel.sh](file:///c:/Projects/doi-moi-simulator/setup-tunnel.sh) (Bash) to automate `cloudflared tunnel route dns` and `cloudflared tunnel run`.

#### [package.json](file:///c:/Projects/doi-moi-simulator/package.json)
- Added `start:tunnel` and `tunnel:route` npm scripts.

---

## Verification Results

### Runtime Verification

```txt
Starting server verification...
🏛️  TRIỂN LÃM SỐ & MÔ PHỎNG QUYẾT SÁCH ĐỔI MỚI (1986 - 2021)
---------------------------------------------------
👉 Museum & Host Hub : http://localhost:3000/
👉 Player Access     : http://192.168.1.92:3000/player
===================================================
GET / -> Status: 200, Has Title: true
GET /player -> Status: 200, Has Join Form: true
QR Code URL test: https://vnr202.l4st-r4ven.io.vn/player?room=DM-9999
Generated QR Data Length: 2886 bytes
✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!
```

- **`/`**: Serves `public/index.html` (Digital Museum & Host Screen).
- **`/player`**: Serves `public/player.html` (Mobile Voting Client).
- **Dynamic QR Code**: Generates valid `data:image/png;base64` encoding `https://vnr202.l4st-r4ven.io.vn/player?room=DM-XXXX`.
- **CORS**: Socket.io allows WSS connections over HTTPS under `vnr202.l4st-r4ven.io.vn`.

---

## Quick Start Commands for Deployment

1. **Navigate to Project Directory**:
   ```bash
   cd C:\Projects\doi-moi-simulator
   ```

2. **Start Node.js Backend**:
   ```bash
   npm start
   ```

3. **Setup Cloudflare DNS Route** (First time only):
   ```bash
   npm run tunnel:route
   ```

4. **Run Cloudflare Tunnel**:
   ```bash
   npm run start:tunnel
   # OR using PowerShell script
   .\setup-tunnel.ps1
   ```
