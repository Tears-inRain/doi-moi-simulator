# 🇻🇳 MÔ PHỎNG QUYẾT SÁCH ĐỔI MỚI (1986 - 2021)
### Interactive Educational Decision-Making Simulator & Minigame

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An interactive, real-time multiplayer educational simulator designed for classrooms, workshops, and historical learning. The teacher/host acts as the **National Strategic Council Chair** projecting a live dashboard on the main screen, while students join via mobile devices (scanning a dynamic QR Code) to vote on strategic economic and diplomatic policy decisions across Vietnam's 35-year **Đổi Mới** era (1986 – 2021).

---

## 📌 TABLE OF CONTENTS
1. [System Architecture & Technology Stack](#-system-architecture--technology-stack)
2. [Project Structure & Key Files](#-project-structure--key-files)
3. [Global State Schema & Data Models](#-global-state-schema--data-models)
4. [Real-time Socket.io Event Protocol](#-real-time-socketio-event-protocol)
5. [Historical Ground Truth & 7 Scenarios Baseline](#-historical-ground-truth--7-scenarios-baseline)
6. [Installation & Setup Guide](#-installation--setup-guide)
7. [AI Agent & LLM Modification Guide](#-ai-agent--llm-modification-guide)

---

## 🏗️ SYSTEM ARCHITECTURE & TECHNOLOGY STACK

```
                      +----------------------------------+
                      |         HOST DASHBOARD           |
                      |   (Projector / Main Screen)      |
                      |  http://localhost:3000/host.html |
                      +----------------+-----------------+
                                       |
                               WebSocket (Socket.io)
                                       |
+------------------------------------+ | +-------------------------------------+
|        NODE.JS EXPRESS SERVER      | | |         STUDENT MOBILE VIEW         |
|         (Port 3000 / LAN IP)       |<-+->|        (QR Code / Room Code)       |
|                                    |   | http://<LAN_IP>:3000/player.html?room|
| - State Machine Engine             |   +-------------------------------------+
| - Dynamic QR Code Generator        |
| - Real-time Vote Aggregator        |
| - Score & Metric Delta Calculator  |
+------------------------------------+
```

- **Backend Runtime**: Node.js (CommonJS) with `Express` (HTTP static server) and `Socket.io` (real-time WebSocket state synchronization).
- **Network Resolution**: Auto-detects IPv4 LAN address (`192.168.x.x`) to generate dynamic QR codes using `qrcode` for mobile access over local Wi-Fi or Tailscale.
- **Frontend Architecture**: Single Page Applications (SPAs) built with standard HTML5, JavaScript (ES6+), and TailwindCSS (CDN).
- **Audio Engine**: Synthesized Web Audio API ([public/js/audio.js](file:///c:/Projects/doi-moi-simulator/public/js/audio.js)) — zero external media asset dependencies.
- **Visual Libraries**: Canvas Confetti (celebration effects) and FontAwesome v6 (icons).

---

## 📂 PROJECT STRUCTURE & KEY FILES

```
c:\Projects\doi-moi-simulator\
├── server.js               # Node.js + Express + Socket.io server & state manager
├── package.json            # Dependencies and scripts (express, socket.io, qrcode, cors)
├── .gitignore              # Excludes node_modules, logs, and env files
├── README.md               # Detailed system documentation (this file)
├── SCENARIOS_DATA.md       # Master historical scenarios & decision tree reference
├── SIMULATOR_ARCHITECTURE.md # Concept & state machine technical specifications
├── UI_UX_SIMULATOR.md      # National Dashboard visual design specifications
├── data/
│   └── scenarios.js        # Complete array of 7 historical scenarios with deltas & feedback
└── public/
    ├── host.html           # Projector / Command Center Dashboard view ("Bảng Điều Khiển Quốc Gia")
    ├── player.html         # Mobile responsive student voting view
    └── js/
        ├── audio.js        # Web Audio API sound synthesizer
        ├── host.js         # Socket client controller for Host screen
        └── player.js       # Socket client controller for Mobile players
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

### 3. Scenario & Option Schema ([data/scenarios.js](file:///c:/Projects/doi-moi-simulator/data/scenarios.js))
```javascript
{
  id: 1,
  year: 1986,
  title: "Năm 1986 - Đêm trước Đổi mới (Khủng hoảng Lạm phát & Lương thực)",
  context: "Lạm phát chạm mốc kỷ lục 774,7%, đất nước thiếu ăn kinh niên...",
  problem: "Hội nghị Đại hội VI cần đưa ra định hướng chiến lược nào...",
  citation: "Chương III, Mục I - Đại hội VI (12/1986) (Giáo trình Lịch sử ĐCSVN)",
  milestone: "Kỷ Nguyên Đổi Mới (Đại hội VI)",
  options: [
    {
      id: "A",
      text: "Tiếp tục duy trì cơ chế kế hoạch hóa tập trung bao cấp...",
      isCorrect: false,
      impact: { economyGDP: -25, qualityOfLife: -25, globalStatus: 0, inflationRate: 150 },
      feedback: "SAI LẦM! Duy trì bao cấp sẽ triệt tiêu động lực sản xuất..."
    },
    {
      id: "B",
      text: '"Nhìn thẳng vào sự thật", xóa bỏ cơ chế tập trung bao cấp...',
      isCorrect: true,
      impact: { economyGDP: 25, qualityOfLife: 20, globalStatus: 10, inflationRate: -400 },
      feedback: "CHÍNH XÁC! Bước ngoặt lịch sử tại Đại hội VI (12/1986)..."
    }
  ]
}
```

---

## 🔄 REAL-TIME SOCKET.IO EVENT PROTOCOL

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `host:create_room` | Host $\rightarrow$ Server | None | Requests room creation. Server responds with `room_created`. |
| `room_created` | Server $\rightarrow$ Host | `{ roomId, joinUrl, qrCodeDataUrl, gameState }` | Initializes Host UI and displays QR Code. |
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

All data is strictly verified against Chapter 3 of ***Giáo trình Lịch sử Đảng cộng sản Việt Nam***:

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

## ⚡ INSTALLATION & SETUP GUIDE

### Prerequisites
- Node.js version 18.x or higher
- Git

### 1. Clone & Install
```bash
git clone https://github.com/Tears-inRain/doi-moi-simulator.git
cd doi-moi-simulator
npm install
```

### 2. Launch the Application
```bash
npm start
```

### 3. Access URLs
- **Host Projector View**: Open **`http://localhost:3000/host.html`** in your browser.
- **Student Mobile View**: Scan the QR Code on the Host screen or open **`http://<YOUR_LOCAL_IP>:3000/player.html`** (e.g. `http://192.168.x.x:3000/player.html?room=DM-XXXX`).

---

## 🤖 AI AGENT & LLM MODIFICATION GUIDE

If you are an AI Coding Agent (e.g., Gemini, ChatGPT, Claude, AutoGPT, Antigravity) tasked with extending or debugging this repository, follow these guidelines:

1. **Adding a New Scenario**:
   - Modify [data/scenarios.js](file:///c:/Projects/doi-moi-simulator/data/scenarios.js). Add a new object following the standard schema (specify `id`, `year`, `title`, `context`, `problem`, `citation`, `milestone`, and 3 options `A`, `B`, `C`).
   - Ensure Option `B` (or `isCorrect: true`) has realistic metric deltas for `economyGDP`, `qualityOfLife`, `globalStatus`, and `inflationRate`.

2. **Modifying Metrics Logic**:
   - Central metrics state is updated inside the `host:reveal_outcome` socket event handler in [server.js](file:///c:/Projects/doi-moi-simulator/server.js).
   - Ensure all metric values remain clamped (`economyGDP`, `qualityOfLife`, `globalStatus` between 0 and 100; `inflationRate` >= 2.5%).

3. **Updating Host or Player UI**:
   - Host dashboard UI logic is in [public/js/host.js](file:///c:/Projects/doi-moi-simulator/public/js/host.js) and markup in [public/host.html](file:///c:/Projects/doi-moi-simulator/public/host.html).
   - Mobile player UI logic is in [public/js/player.js](file:///c:/Projects/doi-moi-simulator/public/js/player.js) and markup in [public/player.html](file:///c:/Projects/doi-moi-simulator/public/player.html).
   - Dynamic inflation thresholds and color card transitions are handled inside `updateMetricsUI()` in [public/js/host.js](file:///c:/Projects/doi-moi-simulator/public/js/host.js).

---

## 📄 LICENSE
This project is open-source under the **MIT License**.
