# DIGITAL MUSEUM MICROSITE SPECIFICATION: 35 NĂM ĐỔI MỚI (1986 - 2021)

## 1. Overall Product Vision
An interactive, real-time single-page digital museum microsite. It connects directly with the existing `doi-moi-simulator` backend (Node.js + Socket.io) and features:
- Interactive Timeline (1986 - 2021) with modal drill-downs.
- Data-driven Infographics & Visualizations (Inflation, GDP, Poverty, Anti-Corruption).
- Editorial / Journalism Section highlighting key Party Congress Decisions & Historic Breakthroughs.
- Embedded Simulator Minigame Hub at the bottom.

## 2. Visual Style & Theme Guidelines
- **Theme**: Dark Editorial / Modern Digital Museum.
- **Color Palette**:
  - Background: Very Dark Blue/Slate `#0F172A` to `#020617`
  - Cards & Glass: `rgba(30, 41, 59, 0.7)` with `backdrop-filter: blur(12px)`
  - Primary Red: `#C8102E` (Vietnam Flag Red)
  - Accent Gold/Yellow: `#FFCD00` / `#EAB308`
  - Text: `#F8FAFC` (Slate 50) and `#94A3B8` (Slate 400)
- **Typography**: Be Vietnam Pro (Google Fonts).

## 3. Structural Sections & Requirements

### Section 1: Hero Banner & Quote
- Title: "HÀNH TRÌNH 35 NĂM ĐỔI MỚI (1986 - 2021)"
- Subtitle: "Triển Lãm Tương Tác Số – Khảo Sát Cơ Đồ & Bản Lĩnh Lãnh Đạo Của Đảng"
- Featured Quote Box:
  > "Đất nước ta chưa bao giờ có được cơ đồ, tiềm lực, vị thế và uy tín quốc tế như ngày nay."
  > — Tổng Bí thư Nguyễn Phú Trọng (Đại hội XIII, 2021)

### Section 2: Real-time Interactive Historical Timeline (1986 - 2021)
- Horizontal / Grid layout containing 7 major clickable historical milestones:
  1. **1986 (Đại hội VI)**: Khởi xướng Đổi mới toàn diện, nhìn thẳng vào sự thật.
  2. **1988 (Khoán 10)**: Nghị quyết 10-NQ/TW, cởi trói nông nghiệp.
  3. **1995 (Phá thế cấm vận)**: Bình thường hóa quan hệ Việt - Mỹ & Gia nhập ASEAN.
  4. **2007 (Gia nhập WTO)**: Thành viên thứ 150 của Tổ chức Thương mại Thế giới.
  5. **2011 (Đại hội XI)**: 3 Đột phá chiến lược & Tái cơ cấu nền kinh tế.
  6. **2016 (Đại hội XII)**: Đẩy mạnh phòng, chống tham nhũng, Nghị quyết TW4.
  7. **2021 (Đại hội XIII)**: Tổng kết 35 năm Đổi mới, Khát vọng phát triển 2045.
- **Interactivity**: Clicking any node opens a rich Modal Window displaying verified quotes, primary textbook sources, and context details.

### Section 3: Data Journalism & Infographics (Verified Data Visualizations)
Visual charts & metrics comparing "Before vs. After" using Chart.js or Tailwind Progress Cards:
1. **Lạm phát & Kinh tế Vĩ mô**:
   - 1986: Lạm phát đỉnh điểm **774,7%** (Cơ chế bao cấp).
   - 2020: Lạm phát kiểm soát ở mức **3,2%**; Tăng trưởng GDP 1991–1995 trung bình **8,2%/năm**.
2. **An ninh Lương thực & Xóa đói giảm nghèo**:
   - Nhập khẩu gạo cứu đói (trước 1988: 450.000 – 1.000.000 tấn/năm) vs Top 3 Nước xuất khẩu gạo thế giới.
   - Tỷ lệ hộ nghèo: **>60%** (đầu 1990s) ➔ **<2,75%** (2020 theo chuẩn nghèo đa chiều).
3. **Phòng, chống Tham nhũng & Chỉnh đốn Đảng**:
   - Infographic mô tả 3 Trụ cột: Nguyên nhân (Chủ quan / Khách quan) ➔ Tác hại ➔ Giải pháp ("Không có vùng cấm, không có ngoại lệ", Nghị quyết TW4 khóa XI, XII).

### Section 4: Editorial Magazine – "Các Quyết Sách Lịch Sử"
Layout structured as newspaper/editorial articles:
- **Bài 1**: "Đêm Trước Đổi Mới & Bước Ngoặt Đại Hội VI (12/1986)"
- **Bài 2**: "Từ Quốc Gia Thiếu Ăn Đến Kỳ Tích Nông Nghiệp Tự Cấp Lương Thực"
- **Bài 3**: "Bản Đồ Hội Nhập Quốc Tế: Phá Bỏ Cấm Vận & Vươn Ra Biển Lớn"
- **Bài 4**: "Đấu Tranh Phòng, Chống Tham Nhũng: Giữ Vững Kỷ Cương & Niềm Tin Của Nhân Dân"

### Section 5: Integrated Doi Moi Decision Simulator (Minigame Hub)
- Mount point and container for the existing Socket.io game host interface.
- Includes Room Code display, QR Code generator container, live player list, and controls to trigger scenarios.
- Player route accessible via `/player`.

## 4. Routing & Express Integration Rules
- File structure inside `public/`:
  - `index.html`: Digital Museum & Game Host
  - `player.html`: Mobile Player Interface
  - `css/museum.css`
  - `js/museum.js`
- Express route setup:
  - `GET /` ➔ Serves `index.html`
  - `GET /player` ➔ Serves `player.html`
  - WebSockets (Socket.io) handling game events.