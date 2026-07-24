# 🇻🇳 MÔ PHỎNG QUYẾT SÁCH ĐỔI MỚI (1986 - 2021)
### Interactive Educational Decision-Making Simulator, Digital Museum & Cloudflare Tunnel Deployment

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black.svg)](https://socket.io/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare_Tunnel-Configured-F38020.svg)](https://www.cloudflare.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An interactive, real-time multiplayer educational simulator and digital museum microsite designed for classrooms, workshops, and historical research. 
> The host acts as the **National Strategic Council Chair** projecting a live dashboard on the main screen (`/host`), while participants join via mobile devices (`/player` via dynamic QR Code) to vote on strategic economic and diplomatic policy decisions across Vietnam's 35-year **Đổi Mới** era (1986 – 2021).
> The system is fully configured for local LAN execution as well as public HTTPS/WSS zero-trust deployment via **Cloudflare Tunnel** (`vnr202.l4st-r4ven.io.vn`).

---

## 📌 TABLE OF CONTENTS
1. [System Architecture & Technology Stack](#-system-architecture--technology-stack)
2. [Public Cloudflare Tunnel Routing & Network Architecture](#-public-cloudflare-tunnel-routing--network-architecture)
3. [Digital Museum & Interactive Tabs](#-digital-museum--interactive-tabs)
4. [Project Structure & Key Files](#-project-structure--key-files)
5. [Global State Schema & Data Models](#-global-state-schema--data-models)
6. [Real-time Socket.io Event Protocol](#-real-time-socketio-event-protocol)
7. [Historical Ground Truth & 7 Scenarios Baseline](#-historical-ground-truth--7-scenarios-baseline)
8. [Dynamic Article API (`/api/articles/:id`)](#-dynamic-article-api-apiarticlesid)
9. [AI Transparency & Citation Appendix](#-ai-transparency--citation-appendix)
10. [Installation, Run & Cloudflare Setup Guide](#-installation-run--cloudflare-setup-guide)
11. [AI Agent & LLM Modification Guide](#-ai-agent--llm-modification-guide)

---

## 🏗️ SYSTEM ARCHITECTURE & TECHNOLOGY STACK

```
                             +-----------------------------------+
                             |     PUBLIC CLOUDFLARE TUNNEL      |
                             |   https://vnr202.l4st-r4ven.io.vn |
                             +-----------------+-----------------+
                                               | (WSS / HTTPS)
                                               v
                             +-----------------------------------+
                             |   LOCAL NODE.JS EXPRESS SERVER    |
                             |      (http://localhost:3000)      |
                             +--------+-----------------+--------+
                                      |                 |
                  WebSocket (Socket.io)                 WebSocket (Socket.io)
                                      v                 v
          +-----------------------------------+   +------------------------------------+
          |       HOST / MUSEUM HUB           |   |       STUDENT MOBILE PLAYER        |
          |   (Projector / Main Screen)       |   |      (QR Code / Mobile UI)         |
          |  https://.../host or / (Museum)   |   |        https://.../player          |
          +-----------------------------------+   +------------------------------------+
```

- **Backend Runtime**: Node.js (CommonJS) with `Express` (HTTP static server & JSON APIs) and `Socket.io` (real-time WebSocket state synchronization with permissive CORS for public tunnels).
- **Public Zero-Trust Tunneling**: Cloudflare Tunnel (`cloudflared`) mapping public domain `vnr202.l4st-r4ven.io.vn` directly to local port `3000` with full WSS support.
- **Dynamic QR Code Engine**: Host screens dynamically compute QR Code links pointing to `window.location.origin + '/player'` or `https://vnr202.l4st-r4ven.io.vn/player`, ensuring seamless cross-device mobile entry over WAN, LAN, or local Wi-Fi.
- **Frontend Architecture**: Responsive Single Page Applications (SPAs) built with semantic HTML5, Vanilla JavaScript (ES6+), Chart.js (data visualization), and TailwindCSS (CDN glassmorphism styling).
- **Audio Synthesizer Engine**: Synthesized Web Audio API ([public/js/audio.js](file:///c:/Projects/doi-moi-simulator/public/js/audio.js)) with defensive initialization logic — zero external audio assets required.

---

## 🌐 PUBLIC CLOUDFLARE TUNNEL ROUTING & NETWORK ARCHITECTURE

The application supports bare-metal local hosting and zero-trust public deployment via Cloudflare Tunnel:

- **Public Domain**: `https://vnr202.l4st-r4ven.io.vn`
- **Local Target**: `http://localhost:3000`
- **WebSocket Protocol**: Secure WebSockets (`wss://vnr202.l4st-r4ven.io.vn/socket.io/`) automatically configured with CORS allowed origins (`*`) in [server.js](file:///c:/Projects/doi-moi-simulator/server.js).
- **Tunnel Config File**: [config.yml](file:///c:/Projects/doi-moi-simulator/config.yml) defines ingress rules for Cloudflare execution.

---

## 🏛️ DIGITAL MUSEUM & INTERACTIVE TABS

The root landing page (`/` or `public/index.html`) serves as the **Digital Museum Microsite & Host Hub**, featuring 5 primary interactive sections:

1. **`#section-hero` (Tổng Quan 35 Năm Đổi Mới)**: Overview of the 1986–2021 historical journey, core national metrics, and quick action entry points.
2. **`#section-timeline` (Tiến Trình 1986 - 2021)**: Interactive timeline nodes with detailed modal overlays detailing historical milestones verified against textbook source material.
3. **`#section-data-visuals` (Dữ Liệu Số)**: Interactive Chart.js graphs tracking GDP growth, hyperinflation collapse (774.7% -> 2.7%), and poverty reduction trends (58.1% -> 2.75%).
4. **`#section-editorial` (Chuyên Đề Báo Chí Văn Kiện)**: Curated magazine grid displaying 4 key historical topics with direct external links to ground-truth press citations (Báo Nhân Dân, VietnamPlus, VOV, Tạp chí Cộng sản).
5. **`#section-simulator` (Minigame Simulator Trực Tuyến)**: Live Socket.io minigame command center for starting classroom voting rooms, managing host sessions, and displaying live QR codes.
6. **`#section-appendix` (Phụ Lục Minh Bạch AI & Nguồn Dẫn)**: Ground-truth reference citations and AI transparency guardrails.

---

## 📂 PROJECT STRUCTURE & KEY FILES

```
c:\Projects\doi-moi-simulator\
├── server.js                      # Node.js + Express + Socket.io server, API routes & game state manager
├── config.yml                     # Cloudflare Tunnel ingress configuration
├── setup-tunnel.ps1               # PowerShell helper script for Cloudflare tunnel setup
├── setup-tunnel.sh                # Bash helper script for Cloudflare tunnel setup
├── package.json                   # Dependencies, engine version, and tunnel scripts
├── .gitignore                     # Excludes node_modules, logs, and sensitive env files
├── README.md                      # Complete system & AI documentation (this file)
├── SCENARIOS_DATA.md              # Master historical scenarios & decision tree reference
├── SIMULATOR_ARCHITECTURE.md        # Concept & state machine technical specifications
├── UI_UX_SIMULATOR.md             # National Dashboard visual design specifications
├── data/
│   └── scenarios.js               # Array of 7 historical scenarios with deltas & feedback
├── public/
│   ├── index.html                 # Digital Museum Microsite & Host Hub landing page (`/`)
│   ├── host.html                  # Standalone Projector / Command Center Dashboard (`/host`)
│   ├── player.html                # Mobile responsive student voting view (`/player`)
│   ├── assets/
│   │   └── articles/              # Local static content for editorial articles
│   │       ├── article1/          # Topic 1: Đại Hội VI (content.txt, source.txt, images)
│   │       ├── article2/          # Topic 2: Khoán 10 (content.txt, source.txt, images)
│   │       ├── article3/          # Topic 3: Đối Ngoại 1995/2007 (content.txt, source.txt, images)
│   │       └── article4/          # Topic 4: Chỉnh Đốn Đảng 2016 (content.txt, source.txt)
│   └── js/
│       ├── audio.js               # Web Audio API sound synthesizer
│       ├── museum.js              # Tab navigation switcher, timeline modal, and Chart.js renderer
│       ├── host.js                # Socket client controller for Host screen & QR code generator
│       └── player.js              # Socket client controller for Mobile player interface
```

---

## 📊 GLOBAL STATE SCHEMA & DATA MODELS

### 1. Central Game State Object (`server.js`)
```json
{
  "year": 1986,
  "metrics": {
    "economyGDP": 50,      // Range: 0 - 100
    "qualityOfLife": 30,   // Range: 0 - 100
    "globalStatus": 20     // Range: 0 - 100
  },
  "inflationRate": 774.7,  // Percentage (%)
  "currentScenarioIndex": 0,
  "votingState": "IDLE",    // Enum: "IDLE" | "VOTING" | "RESULT" | "END_GAME"
  "unlockedMilestones": [],
  "history": []
}
```

### 2. Player Object Structure
```json
{
  "socketId": "BduRV5jiOD8FnNC5AAAB",
  "nickname": "Cố vấn Nam",
  "avatar": "⭐",
  "score": 200,            // Total contribution points earned
  "currentVote": "B"        // "A" | "B" | "C" | null
}
```

---

## 🔄 REAL-TIME SOCKET.IO EVENT PROTOCOL

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `host:create_room` | Host $\rightarrow$ Server | None | Requests room creation. Server responds with `room_created`. |
| `room_created` | Server $\rightarrow$ Host | `{ roomId, joinUrl, qrCodeDataUrl, gameState }` | Initializes Host UI and renders dynamic QR Code. |
| `player:join` | Player $\rightarrow$ Server | `{ roomId, nickname, avatar }` | Connects student mobile player to room. |
| `player:joined_success` | Server $\rightarrow$ Player | `{ roomId, player, gameState, currentScenario }` | Confirms mobile registration and sets active screen. |
| `host:player_list_updated` | Server $\rightarrow$ Host | `{ playersCount, players: [...] }` | Sends sorted leaderboard of players to Host. |
| `host:start_game` | Host $\rightarrow$ Server | `{ roomId }` | Starts scenario 1 (1986) and opens voting state. |
| `scenario:started` | Server $\rightarrow$ Room | `{ scenarioIndex, scenario, gameState }` | Broadcasts new active scenario details to all clients. |
| `player:cast_vote` | Player $\rightarrow$ Server | `{ roomId, optionId }` | Submits option selection (A, B, or C). |
| `host:vote_update` | Server $\rightarrow$ Host | `{ totalVotes, counts, percentages }` | Sends live real-time vote distribution bar percentages to Host. |
| `player:vote_acknowledged` | Server $\rightarrow$ Player | `{ optionId }` | Confirms vote lock-in on mobile and disables buttons. |
| `host:reveal_outcome` | Host $\rightarrow$ Server | `{ roomId }` | Calculates majority option, updates metrics, awards points. |
| `player:score_updated` | Server $\rightarrow$ Player | `{ score, pointsEarned }` | Updates individual mobile player's score badge. |
| `scenario:outcome` | Server $\rightarrow$ Room | `{ winningOption, votePercentages, newMetrics, newInflation, impact, milestoneUnlocked, leaderboard }` | Displays historical outcome modal on Host screen and mobile. |
| `host:next_scenario` | Host $\rightarrow$ Server | `{ roomId }` | Advances to next year or triggers `game:ended`. |
| `game:ended` | Server $\rightarrow$ Room | `{ finalMetrics, finalInflation, unlockedMilestones, titleRating, summaryText, leaderboard }` | Displays 35-year Doi Moi final summary screen. |
| `host:restart_game` | Host $\rightarrow$ Server | `{ roomId }` | Resets metrics and restarts simulation back to 1986. |

---

## 📜 HISTORICAL GROUND TRUTH & 7 SCENARIOS BASELINE

All data is strictly verified against Chapter 3 of ***Giáo trình Lịch sử Đảng cộng sản Việt Nam*** (NXB Chính trị quốc gia Sự thật) and official statistical publications:

1. **1986 – Đêm trước Đổi mới (Khủng hoảng Lạm phát 774.7% & Lương thực)**:
   - *Key decision*: Đại hội VI (12/1986) "Nhìn thẳng vào sự thật", eliminating central subsidization, introducing 3 Major Economic Programs (Food, Consumer Goods, Exports).
2. **1988 – Giải phóng Sức sản xuất Nông nghiệp (Khoán 10)**:
   - *Key decision*: Resolution 10-NQ/TW (4/1988), household land autonomy. By 1989, Vietnam transformed from food deficit to exporting 1.4 million tons of rice; inflation dropped to 34.7%.
3. **1995 – Bứt phá Đối ngoại & Phá thế Cấm vận**:
   - *Key decision*: Normalization of relations with the United States (July 11, 1995) and joining ASEAN (July 28, 1995). Single-digit inflation achieved (9.7%).
4. **2007 – Hội nhập Kinh tế Toàn cầu (Gia nhập WTO)**:
   - *Key decision*: Joining World Trade Organization as the 150th member (January 11, 2007). Exited low-income status by 2008 into lower-middle-income group.
5. **2011 – Chuyển đổi Mô hình Tăng trưởng & 3 Đột phá Chiến lược**:
   - *Key decision*: Đại hội XI (1/2011) approving 3 Strategic Breakthroughs (market institutions, high-quality human resources, modern infrastructure).
6. **2016 – Đẩy mạnh Phòng, Chống Tham nhũng & Chỉnh đốn Đảng**:
   - *Key decision*: Resolution TW 4 (Khóa XII), anti-corruption drive ("No forbidden zones, no exceptions").
7. **2021 – Nhìn lại 35 năm Đổi mới & Khát vọng 2045**:
   - *Key decision*: Đại hội XIII (1/2021) reaffirming 35-year achievements ("Vietnam has never possessed such opportunity, potential, standing and international prestige") and establishing visions for 2030 & 2045.

---

## 📰 DYNAMIC ARTICLE API (`/api/articles/:id`)

The server exposes a REST API endpoint to dynamically serve historical editorial articles:

- **Endpoint**: `GET /api/articles/:id` (`:id` ranges from 1 to 4)
- **Data Source**: `public/assets/articles/article{id}/`
- **JSON Payload Response**:
  ```json
  {
    "id": "1",
    "title": "Đêm Trước Đổi Mới & Bước Ngoặt Đại Hội VI (12/1986)",
    "category": "ĐẠI HỘI VI (1986)",
    "content": "Full raw text loaded from content.txt...",
    "sourceUrl": "https://www.vietnamplus.vn/...",
    "images": [
      "/assets/articles/article1/cover.avif",
      "/assets/articles/article1/dai-hoi-lan-thu-vi-cua-dang-2.avif"
    ]
  }
  ```

---

## 🛡️ AI TRANSPARENCY & CITATION APPENDIX

Located in `#section-appendix` on the root page, the project adheres to strict academic guardrails:

- **Ground-Truth Primary Sources**: Citing *Giáo trình Lịch sử ĐCSVN*, General Statistics Office (GSO), World Bank, Báo Nhân Dân, Báo Điện tử Chính phủ, Tạp chí Cộng sản, VietnamPlus, and VOV.
- **AI Agent Role**: AI Agents (e.g. Antigravity) act solely as software engineers and UI/UX developers under strict human supervision.
- **Zero Hallucination Binding**: Simulation metrics, historical outcomes, and textual contents are statically bound to verified data structures (`data/scenarios.js` and `public/assets/articles/`), ensuring zero synthetic or unverified historical claims.

---

## ⚡ INSTALLATION, RUN & CLOUDFLARE SETUP GUIDE

### Prerequisites
- Node.js version 18.x or higher
- Git
- Cloudflare CLI (`cloudflared`) — *Optional for public tunneling*

### 1. Clone & Install
```bash
git clone https://github.com/Tears-inRain/doi-moi-simulator.git
cd doi-moi-simulator
npm install
```

### 2. Launch Local Express Server
```bash
npm start
```
*Server starts on `http://localhost:3000` (or `PORT` environment variable).*

### 3. Launch Public Cloudflare Tunnel (Optional)
To expose the site publicly at `https://vnr202.l4st-r4ven.io.vn`:
```bash
# Using npm script (requires cloudflared installed)
npm run tunnel

# Or run directly via config.yml
cloudflared tunnel --config config.yml run
```

### 4. Access Routes
- **Digital Museum & Host Hub**: Open `http://localhost:3000/` or `https://vnr202.l4st-r4ven.io.vn/`
- **Standalone Host Projector View**: Open `http://localhost:3000/host` or `https://vnr202.l4st-r4ven.io.vn/host`
- **Student Mobile View**: Scan the host QR Code or open `http://localhost:3000/player` or `https://vnr202.l4st-r4ven.io.vn/player`

---

## 🤖 AI AGENT & LLM MODIFICATION GUIDE

If you are an AI Coding Agent (e.g., Gemini, ChatGPT, Claude, AutoGPT, Antigravity) tasked with extending or debugging this repository, follow these guidelines:

1. **Adding or Editing Scenarios**:
   - Modify [data/scenarios.js](file:///c:/Projects/doi-moi-simulator/data/scenarios.js). Add or edit objects adhering to the standard schema (`id`, `year`, `title`, `context`, `problem`, `citation`, `milestone`, `options`).
   - Keep option `B` (or `isCorrect: true`) aligned with historical consensus and maintain balanced metric deltas (`economyGDP`, `qualityOfLife`, `globalStatus`, `inflationRate`).

2. **Modifying Server State Machine**:
   - State mutation and score distribution take place inside `host:reveal_outcome` in [server.js](file:///c:/Projects/doi-moi-simulator/server.js).
   - Ensure metric boundaries remain clamped (`0 <= metric <= 100`, `inflationRate >= 2.5%`).

3. **Modifying Museum & Host UI**:
   - Tab switching, timeline modals, and Chart.js visualizations are located in [public/js/museum.js](file:///c:/Projects/doi-moi-simulator/public/js/museum.js).
   - Host projector screen logic is in [public/js/host.js](file:///c:/Projects/doi-moi-simulator/public/js/host.js) and [public/host.html](file:///c:/Projects/doi-moi-simulator/public/host.html).
   - Mobile player client logic is in [public/js/player.js](file:///c:/Projects/doi-moi-simulator/public/js/player.js) and [public/player.html](file:///c:/Projects/doi-moi-simulator/public/player.html).

4. **Preserving Defensive Code**:
   - All audio calls MUST be guarded with `if (window.SoundEngine) { try { ... } catch(e){} }` to prevent unhandled Web Audio API errors.
   - All DOM queries for tab sections MUST handle missing elements gracefully with fallbacks.

---

## 📄 LICENSE
This project is open-source under the **MIT License**.
