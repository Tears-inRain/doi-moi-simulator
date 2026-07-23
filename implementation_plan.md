# Implementation Plan - Mô phỏng Quyết sách Đổi mới (1986 - 2021)

Build a fully functional, production-ready interactive decision-making minigame titled **"MÔ PHỎNG QUYẾT SÁCH ĐỔI MỚI (1986 - 2021)"**. The application features a real-time Host (Projector Screen) dashboard and Player (Student Mobile) interface synchronized via WebSockets (Socket.io).

## Technical Architecture & Design Decisions

- **Backend**: Node.js + Express + Socket.io server handling room management, real-time vote aggregation, state updates, delta calculations, and dynamic QR code generation.
- **Frontend Stack**: Single-page dashboards using HTML5, TailwindCSS (via CDN), Google Fonts (Be Vietnam Pro, Montserrat), FontAwesome icons, Canvas Confetti, and native Web Audio API sound synthesis.
- **Theme & Aesthetics**: Premium National Strategic Command Center Dashboard ("Bảng điều khiển Quốc gia") featuring deep slate glassmorphism dark mode, Red (#C8102E) & Gold (#FFCD00) accents, live metric gauges, timeline markers, and animated vote counters.
- **Historical Accuracy**: Grounded in Chapter 3 of *Giáo trình Lịch sử Đảng cộng sản Việt Nam*, covering 7 major milestone scenarios (1986, 1988, 1995, 2007, 2011, 2016, 2021) with exact policy names, dates, metrics, and educational feedback.

---

## Proposed Changes

### Backend Infrastructure

#### [NEW] [package.json](file:///c:/Projects/doi-moi-simulator/package.json)
- Define project dependencies (`express`, `socket.io`, `qrcode`, `ip`, `cors`).
- Define scripts: `"start": "node server.js"`.

#### [NEW] [server.js](file:///c:/Projects/doi-moi-simulator/server.js)
- Set up HTTP server on port 3000 (configurable via `PORT` environment variable).
- Dynamic local IP detection so host display shows QR code & network URL (e.g. `http://192.168.x.x:3000/player.html?room=...`).
- Implement Socket.io state machine:
  - `host:create_room`: Instantiates game session.
  - `player:join`: Handles player nickname & room connection.
  - `host:start_scenario`: Broadcasts scenario content.
  - `player:cast_vote`: Aggregates live votes.
  - `host:reveal_outcome`: Computes winning choice, applies metric deltas, calculates player contribution points, and returns outcome details.
  - `host:next_scenario` & `host:restart_game`.

#### [NEW] [data/scenarios.js](file:///c:/Projects/doi-moi-simulator/data/scenarios.js)
- Export complete historical data for all 7 scenarios matching `SCENARIOS_DATA.md` and textbook ground truth:
  1. 1986 - Đêm trước Đổi mới (Khủng hoảng Lạm phát 774.7% & Lương thực, Đại hội VI)
  2. 1988 - Giải phóng Sức sản xuất Nông nghiệp (Khoán 10 - Nghị quyết 10-NQ/TW)
  3. 1995 - Bứt phá Đối ngoại & Phá thế Cấm vận (Bình thường hóa quan hệ Mỹ 11/7/1995, Gia nhập ASEAN 28/7/1995)
  4. 2007 - Hội nhập Kinh tế Toàn cầu (Gia nhập WTO 11/1/2007 - Thành viên 150)
  5. 2011 - Chuyển đổi Mô hình Tăng trưởng & 3 Đột phá Chiến lược (Đại hội XI)
  6. 2016 - Đẩy mạnh Phòng, Chống Tham nhũng & Chỉnh đốn Đảng (Nghị quyết TW 4 Khóa XII - "Đốt lò")
  7. 2021 - Nhìn lại 35 năm Đổi mới & Khát vọng 2045 (Đại hội XIII)

---

### Frontend Host & Player Interfaces

#### [NEW] [public/host.html](file:///c:/Projects/doi-moi-simulator/public/host.html)
- Main Projector Screen Dashboard:
  - Header with National Title, Room Code, QR Code popup modal, and player list counter.
  - Top Bar Gauges: GDP / Economy, Quality of Life, International Standing, Inflation Rate (with dynamic status tag e.g., "Siêu lạm phát" vs "Kiểm soát an toàn").
  - Timeline Bar highlighting progress across 1986 – 2021.
  - Main Crisis Stage: Scenario Title, Historical Context Box, Policy Options (A, B, C).
  - Real-time Voting Breakdown Chart (live updating bar/percentage counters as mobile votes arrive).
  - Outcome Modal & Historical Explanation Card with textbook quotes & milestone badges unlocked.
  - Final Game Summary Screen: Total score evaluation, national development trajectory chart, unlocked badges, and concluding historical lessons.

#### [NEW] [public/player.html](file:///c:/Projects/doi-moi-simulator/public/player.html)
- Mobile-optimized interface for students:
  - Join Screen: Room Code (auto-filled if URL parameter exists) + Nickname input + Avatar selection.
  - Waiting Lounge: Room info, status, list of fellow strategic council members.
  - Voting View: Current scenario details, touch-friendly option cards A, B, C with impact indicators.
  - Lock-in Feedback: Confirmation message after voting with real-time waiting spinner.
  - Outcome Reveal View: Instant notification on mobile of whether the class majority selected their option, contribution points awarded, and national metric impact summary.

#### [NEW] [public/js/audio.js](file:///c:/Projects/doi-moi-simulator/public/js/audio.js)
- Web Audio API Sound Generator for rich user experience without external media dependencies (click sound, countdown beep, positive outcome fanfare, inflation drop sound effect).

#### [NEW] [public/js/host.js](file:///c:/Projects/doi-moi-simulator/public/js/host.js)
- Host socket client logic, gauge score count-up animations, chart updates, modal controls, and state transitions.

#### [NEW] [public/js/player.js](file:///c:/Projects/doi-moi-simulator/public/js/player.js)
- Mobile socket client logic, vote selection, button states, score persistence, and feedback screen.

---

## Verification Plan

### Automated & Manual Tests
1. **Dependency & Server Boot**:
   - Run `npm install` and `node server.js` to ensure clean startup without syntax or module errors.
2. **Multi-Client Verification**:
   - Open `http://localhost:3000/host.html` in browser to generate Room ID & QR Code.
   - Open multiple player browser windows (`http://localhost:3000/player.html?room=<ROOM_ID>`) representing mobile users.
   - Verify socket connections, real-time live vote counts updating on host dashboard, reveal outcome calculations, state deltas, metric animations, historical popups, and final summary screen.
