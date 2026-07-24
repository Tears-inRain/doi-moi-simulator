/* ==========================================================================
   DIGITAL MUSEUM & SIMULATOR HOST ENGINE
   Handles Tab Navigation, Timeline Modals, Data Journalism Chart.js, and Socket.io Simulator
   ========================================================================== */

// Detailed Historical Timeline Data matching Chapter 3 of Textbook
const MUSEUM_TIMELINE_DATA = {
  1986: {
    year: 1986,
    title: "Khởi Xướng Công Cuộc Đổi Mới Toàn Diện (Đại Hội VI)",
    badge: "Bước Ngoặt Lịch Sử",
    quote: '"Đại hội VI của Đảng (12/1986) là Đại hội mở đầu công cuộc Đổi mới toàn diện, đánh dấu bước ngoặt lịch sử đưa đất nước thoát khỏi khủng hoảng kinh tế - xã hội."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục I (Đại hội VI & Đường lối Đổi mới)",
    stats: [
      { label: "Lạm Phát Đỉnh Điểm 1986", val: "774,7%" },
      { label: "Định Hướng Kinh Tế", val: "Ba Chương Trình Kinh Tế Lớn" },
      { label: "Phương Châm Nòng Cốt", val: "Nhìn Thẳng Vào Sự Thật" }
    ],
    details: `
      <p class="mb-3">Trước Đại hội VI, đất nước lâm vào khủng hoảng kinh tế - xã hội nghiêm trọng do duy trì quá lâu cơ chế tập trung bao cấp và tư tưởng chủ quan, nóng vội trong xây dựng CNXH.</p>
      <p class="mb-3">Đại hội VI (12/1986) tại Hà Nội đã đề ra đường lối Đổi mới toàn diện, trọng tâm là Đổi mới kinh tế: xóa bỏ bao cấp, phát triển nền kinh tế nhiều thành phần, tập trung nguồn lực cho <strong>Ba chương trình kinh tế lớn: Lương thực - thực phẩm, Hàng tiêu dùng, và Hàng xuất khẩu</strong>.</p>
    `
  },
  1988: {
    year: 1988,
    title: "Giải phóng Sức Sản Xuất Nông Nghiệp (Khoán 10)",
    badge: "Kỳ Tích Nông Nghiệp",
    quote: '"Nghị quyết 10-NQ/TW của Bộ Chính trị (4/1988) công nhận hộ nông dân là đơn vị kinh tế tự chủ, giải phóng triệt để sức sản xuất nông nghiệp."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục I (Nghị quyết 10-NQ/TW Bộ Chính trị khóa VI)",
    stats: [
      { label: "Nhập Khẩu Gạo Trước 1988", val: "450k – 1M tấn/năm" },
      { label: "Xuất Khẩu Gạo 1989", val: "1,4 Triệu Tấn" },
      { label: "Lạm Phát Hạ Nhiệt 1989", val: "34,7%" }
    ],
    details: `
      <p class="mb-3">Mô hình hợp tác xã kiểu cũ khiến nông dân không tha thiết với ruộng đất, Nhà nước mỗi năm phải chi ngân sách nhập khẩu hàng trăm nghìn đến 1 triệu tấn gạo cứu đói.</p>
      <p class="mb-3">Tháng 4/1988, Bộ Chính trị khóa VI ban hành <strong>Nghị quyết 10-NQ/TW (Khoán 10)</strong>, giao quyền sử dụng đất lâu dài cho hộ gia đình và tự do lưu thông nông sản. Ngay năm 1989, Việt Nam biến chuyển kỳ diệu từ quốc gia thiếu ăn trở thành nước xuất khẩu gạo đứng thứ 3 thế giới (1,4 triệu tấn gạo).</p>
    `
  },
  1995: {
    year: 1995,
    title: "Bứt Phá Đối Ngoại: Phá Thế Cấm Vận & Gia Nhập ASEAN",
    badge: "Hội Nhập Quốc Tế",
    quote: '"Năm 1995 đánh dấu thắng lợi rực rỡ của đường lối đối ngoại độc lập, tự chủ, đa phương hóa, đa dạng hóa: Bình thường hóa quan hệ Việt - Mỹ và Gia nhập ASEAN."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục II (Hội nhập quốc tế & Phá cấm vận)",
    stats: [
      { label: "Bình Thường Hóa Quan Hệ Mỹ", val: "11 / 07 / 1995" },
      { label: "Gia Nhập Hiệp Hội ASEAN", val: "28 / 07 / 1995" },
      { label: "Lạm Phát Kiểm Soát", val: "9,7% (1 chữ số)" }
    ],
    details: `
      <p class="mb-3">Sau khi Liên Xô sụp đổ (1991), Việt Nam đối mặt với thách thức mất đi thị trường truyền thống và vẫn bị Mỹ cấm vận kinh tế.</p>
      <p class="mb-3">Bằng bản lĩnh ngoại giao sáng suốt, tháng 7/1995 Việt Nam chính thức bình thường hóa quan hệ với Hoa Kỳ và kết nạp vào Hiệp hội các quốc gia Đông Nam Á (ASEAN), mở ra kỷ nguyên hội nhập toàn diện, thu hút dòng vốn đầu tư nước ngoài (FDI).</p>
    `
  },
  2007: {
    year: 2007,
    title: "Hội Nhập Kinh Tế Toàn Cầu (Gia Nhập WTO)",
    badge: "Thành Viên Thứ 150 WTO",
    quote: '"Việt Nam chính thức trở thành thành viên thứ 150 của Tổ chức Thương mại Thế giới (WTO) ngày 11/1/2007, khẳng định vị thế bình đẳng trên sân chơi kinh tế toàn cầu."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục II (Gia nhập WTO năm 2007)",
    stats: [
      { label: "Ngày Gia Nhập WTO", val: "11 / 01 / 2007" },
      { label: "Thoát Nhóm Nước Nghèo", val: "Năm 2008" },
      { label: "Kim Ngạch XNK Bứt Phá", val: "> 100 Tỷ USD" }
    ],
    details: `
      <p class="mb-3">Sau 11 năm đàm phán kiên trì, ngày 11/1/2007, Việt Nam chính thức là thành viên thứ 150 của WTO, chấp nhận cam kết mở cửa thương mại minh bạch.</p>
      <p class="mb-3">Đến năm 2008, Việt Nam chính thức bước qua ngưỡng nước nghèo kém phát triển, gia nhập nhóm các quốc gia đang phát triển có thu nhập trung bình.</p>
    `
  },
  2011: {
    year: 2011,
    title: "3 Đột Phá Chiến Lược & Tái Cơ Cấu Nền Kinh Tế (Đại Hội XI)",
    badge: "Đổi Mới Mô Hình Tăng Trưởng",
    quote: '"Đại hội XI (1/2011) thông qua Chiến lược phát triển kinh tế 2011–2020, xác định 3 Đột phá chiến lược để đưa đất nước phát triển nhanh và bền vững."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục III (Đại hội XI & 3 Đột phá chiến lược)",
    stats: [
      { label: "Thể Chế Kinh Tế", val: "Đột Phá 1" },
      { label: "Nguồn Nhân Lực", val: "Đột Phá 2" },
      { label: "Hạ Tầng Đồng Bộ", val: "Đột Phá 3" }
    ],
    details: `
      <p class="mb-3">Tác động của khủng hoảng tài chính toàn cầu 2008 bộc lộ hạn chế của mô hình tăng trưởng rộng dựa vào tài nguyên và lao động giá rẻ.</p>
      <p class="mb-3">Đại hội XI (1/2011) đề ra 3 đột phá chiến lược: (1) Hoàn thiện thể chế kinh tế thị trường định hướng XHCN, (2) Phát triển nguồn nhân lực chất lượng cao, (3) Xây dựng kết cấu hạ tầng đồng bộ nhằm chuyển dịch mô hình tăng trưởng chiều sâu.</p>
    `
  },
  2016: {
    year: 2016,
    title: "Đẩy Mạnh Phòng, Chống Tham Nhũng & Chỉnh Đốn Đảng (Đại Hội XII)",
    badge: "Không Có Vùng Cấm",
    quote: '"Ban hành Nghị quyết Trung ương 4 (Khóa XII) về xây dựng, chỉnh đốn Đảng với phương châm \"Không có vùng cấm, không có ngoại lệ, bất kể người đó là ai\"."',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục III (Đại hội XII & Nghị quyết TW4)",
    stats: [
      { label: "Nghị Quyết Nòng Cốt", val: "TW 4 Khóa XII" },
      { label: "Phương Châm", val: "Không Có Vùng Cấm" },
      { label: "Mục Tiêu", val: "Củng Cố Niềm Tin Dân" }
    ],
    details: `
      <p class="mb-3">Mặt trái kinh tế thị trường làm suy thoái tư tưởng chính trị, đạo đức, nảy sinh tham nhũng và "nhóm lợi ích" làm giảm sút lòng tin của nhân dân.</p>
      <p class="mb-3">Đại hội XII và Nghị quyết TW 4 (Khóa XII) thể hiện quyết tâm chính trị chưa từng có: kiên quyết xử lý nghiêm các vụ án kinh tế - tham nhũng lớn, siết chặt kỷ cương và củng cố bản chất cách mạng của Đảng.</p>
    `
  },
  2021: {
    year: 2021,
    title: "Tổng Kết 35 Năm Đổi Mới & Khát Vọng Phát Triển 2045 (Đại Hội XIII)",
    badge: "Tầm Nhìn Hào Hùng",
    quote: '"Đất nước ta chưa bao giờ có được cơ đồ, tiềm lực, vị thế và uy tín quốc tế như ngày nay." — Tổng Bí thư Nguyễn Phú Trọng (Đại hội XIII)',
    citation: "Giáo trình Lịch sử ĐCSVN - Chương III, Mục III (Đại hội XIII năm 2021)",
    stats: [
      { label: "Mục Tiêu 2030", val: "TN Trung Bình Cao" },
      { label: "Mục Tiêu 2045", val: "Nước Phát Triển" },
      { label: "Lạm Phát 2020", val: "3,2%" }
    ],
    details: `
      <p class="mb-3">Đại hội XIII (1/2021) tổng kết toàn diện 35 năm Đổi mới (1986–2021), khẳng định những thành tựu có ý nghĩa lịch sử to lớn.</p>
      <p class="mb-3">Đại hội xác định tầm nhìn vươn lên: đến 2030 (kỷ niệm 100 năm thành lập Đảng) trở thành nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao; đến 2045 (kỷ niệm 100 năm thành lập nước) trở thành nước phát triển, thu nhập cao.</p>
    `
  }
};

let chartInflationInstance = null;
let chartPovertyInstance = null;

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. TAB NAVIGATION SWITCHER LOGIC
  // --------------------------------------------------------------------------
  const tabSections = document.querySelectorAll('.museum-tab-section');
  const navTabBtns = document.querySelectorAll('.nav-tab-btn');

  function switchTab(tabId) {
    if (!tabId) tabId = 'hero';
    const cleanTabId = tabId.replace('#', '');

    // Hide all sections
    tabSections.forEach(sec => sec.classList.add('hidden'));

    // Deactivate all nav buttons
    navTabBtns.forEach(btn => btn.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(`section-${cleanTabId}`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    } else {
      const fallback = document.getElementById('section-hero');
      if (fallback) fallback.classList.remove('hidden');
    }

    // Activate corresponding nav button
    const targetBtn = document.querySelector(`.nav-tab-btn[data-tab="${cleanTabId}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger chart rendering when Data Visuals tab is selected
    if (cleanTabId === 'data-visuals') {
      setTimeout(() => initMuseumCharts(), 100);
    }
  }

  // Attach click listeners to nav buttons and deep action links
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      SoundEngine.playClick();
      const tabTarget = btn.getAttribute('data-tab');
      window.location.hash = tabTarget;
      switchTab(tabTarget);
    });
  });

  // Handle URL hash changes
  window.addEventListener('hashchange', () => {
    switchTab(window.location.hash);
  });

  // Initial tab load based on URL hash or default to hero
  if (window.location.hash) {
    switchTab(window.location.hash);
  } else {
    switchTab('hero');
  }

  // --------------------------------------------------------------------------
  // 2. TIMELINE INTERACTIVITY & MODAL HANDLING
  // --------------------------------------------------------------------------
  const museumModal = document.getElementById('museumTimelineModal');
  const closeMuseumModalBtn = document.getElementById('closeMuseumModalBtn');
  const modalYearTag = document.getElementById('modalYearTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalQuote = document.getElementById('modalQuote');
  const modalCitation = document.getElementById('modalCitation');
  const modalStatsGrid = document.getElementById('modalStatsGrid');
  const modalDetailsText = document.getElementById('modalDetailsText');

  document.querySelectorAll('.timeline-clickable-node').forEach(node => {
    node.addEventListener('click', () => {
      const year = node.getAttribute('data-year');
      const data = MUSEUM_TIMELINE_DATA[year];
      if (!data) return;

      SoundEngine.playClick();

      modalYearTag.textContent = `NĂM ${data.year} • ${data.badge}`;
      modalTitle.textContent = data.title;
      modalQuote.textContent = data.quote;
      modalCitation.textContent = data.citation;

      modalStatsGrid.innerHTML = data.stats.map(s => `
        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
          <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">${s.label}</span>
          <span class="font-mono text-base font-black text-amber-300">${s.val}</span>
        </div>
      `).join('');

      modalDetailsText.innerHTML = data.details;
      museumModal.classList.remove('hidden');
    });
  });

  if (closeMuseumModalBtn) {
    closeMuseumModalBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      museumModal.classList.add('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 3. DATA JOURNALISM CHART.JS INITIALIZATION
  // --------------------------------------------------------------------------
  function initMuseumCharts() {
    // Chart 1: Inflation Drop Trend
    const ctxInflation = document.getElementById('chartInflationTrend');
    if (ctxInflation && window.Chart) {
      if (chartInflationInstance) chartInflationInstance.destroy();
      chartInflationInstance = new Chart(ctxInflation, {
        type: 'line',
        data: {
          labels: ['1986', '1989', '1995', '2007', '2011', '2016', '2020'],
          datasets: [{
            label: 'Tỷ lệ Lạm phát (%)',
            data: [774.7, 34.7, 9.7, 12.7, 18.1, 2.7, 3.2],
            borderColor: '#C8102E',
            backgroundColor: 'rgba(200, 16, 46, 0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#FFCD00',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#CBD5E1', font: { family: 'Be Vietnam Pro' } } }
          },
          scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // Chart 2: Poverty Reduction Trend
    const ctxPoverty = document.getElementById('chartPovertyTrend');
    if (ctxPoverty && window.Chart) {
      if (chartPovertyInstance) chartPovertyInstance.destroy();
      chartPovertyInstance = new Chart(ctxPoverty, {
        type: 'bar',
        data: {
          labels: ['1993', '1998', '2004', '2010', '2016', '2020'],
          datasets: [{
            label: 'Tỷ lệ hộ nghèo (%)',
            data: [58.1, 37.4, 19.5, 14.2, 5.8, 2.75],
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderColor: '#10B981',
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#CBD5E1', font: { family: 'Be Vietnam Pro' } } }
          },
          scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. EMBEDDED DECISION SIMULATOR HOST CLIENT LOGIC
  // --------------------------------------------------------------------------
  const socket = io();

  let roomId = null;
  let currentScenarioIndex = 0;
  let totalScenarios = 7;

  // DOM Elements - Simulator
  const displayRoomId = document.getElementById('displayRoomId');
  const playerCountDisplay = document.getElementById('playerCountDisplay');
  const toggleQrBtn = document.getElementById('toggleQrBtn');
  const qrModal = document.getElementById('qrModal');
  const closeQrModalBtn = document.getElementById('closeQrModalBtn');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const qrJoinUrlText = document.getElementById('qrJoinUrlText');

  // Metrics DOM
  const gdpValDisplay = document.getElementById('gdpValDisplay');
  const gdpBar = document.getElementById('gdpBar');
  const qolValDisplay = document.getElementById('qolValDisplay');
  const qolBar = document.getElementById('qolBar');
  const statusValDisplay = document.getElementById('statusValDisplay');
  const statusBar = document.getElementById('statusBar');
  const inflationValDisplay = document.getElementById('inflationValDisplay');
  const inflationBadge = document.getElementById('inflationBadge');
  const inflationCard = document.getElementById('inflationCard');

  // Scenario DOM
  const scenarioYearTag = document.getElementById('scenarioYearTag');
  const scenarioIndexTag = document.getElementById('scenarioIndexTag');
  const scenarioTitle = document.getElementById('scenarioTitle');
  const scenarioContext = document.getElementById('scenarioContext');
  const scenarioProblem = document.getElementById('scenarioProblem');

  // Vote Bars DOM
  const totalVotesBadge = document.getElementById('totalVotesBadge');
  const optionAText = document.getElementById('optionAText');
  const optionBText = document.getElementById('optionBText');
  const optionCText = document.getElementById('optionCText');
  const barA = document.getElementById('barA');
  const barB = document.getElementById('barB');
  const barC = document.getElementById('barC');
  const pctA = document.getElementById('pctA');
  const pctB = document.getElementById('pctB');
  const pctC = document.getElementById('pctC');
  const topPlayersList = document.getElementById('topPlayersList');

  // Controls DOM
  const votingStatusText = document.getElementById('votingStatusText');
  const startScenarioBtn = document.getElementById('startScenarioBtn');
  const revealOutcomeBtn = document.getElementById('revealOutcomeBtn');
  const nextScenarioBtn = document.getElementById('nextScenarioBtn');
  const restartGameBtn = document.getElementById('restartGameBtn');

  // Outcome Modal DOM
  const outcomeModal = document.getElementById('outcomeModal');
  const closeOutcomeModalBtn = document.getElementById('closeOutcomeModalBtn');
  const modalContinueBtn = document.getElementById('modalContinueBtn');
  const outcomeWinnerTitle = document.getElementById('outcomeWinnerTitle');
  const gdpImpactTag = document.getElementById('gdpImpactTag');
  const qolImpactTag = document.getElementById('qolImpactTag');
  const statusImpactTag = document.getElementById('statusImpactTag');
  const inflationImpactTag = document.getElementById('inflationImpactTag');
  const milestoneContainer = document.getElementById('milestoneContainer');
  const milestoneTitle = document.getElementById('milestoneTitle');
  const historicalFeedbackText = document.getElementById('historicalFeedbackText');
  const textbookCitation = document.getElementById('textbookCitation');

  // Simulator Views
  const simGameView = document.getElementById('simGameView');
  const simFinalSummaryView = document.getElementById('simFinalSummaryView');

  // Host creates room on load
  socket.emit('host:create_room', { origin: window.location.origin });

  socket.on('room_created', (data) => {
    roomId = data.roomId;
    totalScenarios = data.scenariosCount || 7;
    if (displayRoomId) displayRoomId.textContent = roomId;
    if (qrCodeImg) qrCodeImg.src = data.qrCodeDataUrl;
    if (qrJoinUrlText) qrJoinUrlText.textContent = data.joinUrl;
    updateMetricsUI(data.gameState.metrics, data.gameState.inflationRate);
  });

  socket.on('host:player_list_updated', (data) => {
    if (playerCountDisplay) playerCountDisplay.textContent = data.playersCount;
    if (topPlayersList) {
      if (data.players && data.players.length > 0) {
        topPlayersList.innerHTML = data.players.map(p => `
          <span class="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold text-xs">
            <span>${p.avatar || '⭐'}</span>
            <span>${p.nickname}</span>
            <span class="text-amber-300 font-bold text-[10px]">(${p.score}đ)</span>
          </span>
        `).join('');
      } else {
        topPlayersList.innerHTML = `<span class="text-slate-500 italic text-xs">Đang chờ thành viên tham gia...</span>`;
      }
    }
  });

  // Simulator Button Controls
  if (toggleQrBtn) {
    toggleQrBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (qrModal) qrModal.classList.remove('hidden');
    });
  }

  if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (qrModal) qrModal.classList.add('hidden');
    });
  }

  if (closeOutcomeModalBtn) {
    closeOutcomeModalBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (outcomeModal) outcomeModal.classList.add('hidden');
    });
  }

  if (modalContinueBtn) {
    modalContinueBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (outcomeModal) outcomeModal.classList.add('hidden');
    });
  }

  if (startScenarioBtn) {
    startScenarioBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (roomId) socket.emit('host:start_game', { roomId });
    });
  }

  if (revealOutcomeBtn) {
    revealOutcomeBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (roomId) socket.emit('host:reveal_outcome', { roomId });
    });
  }

  if (nextScenarioBtn) {
    nextScenarioBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (roomId) socket.emit('host:next_scenario', { roomId });
    });
  }

  if (restartGameBtn) {
    restartGameBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (roomId) socket.emit('host:restart_game', { roomId });
    });
  }

  // Socket Simulator Events
  socket.on('scenario:started', (data) => {
    SoundEngine.playClick();
    currentScenarioIndex = data.scenarioIndex;

    if (outcomeModal) outcomeModal.classList.add('hidden');
    if (simGameView) simGameView.classList.remove('hidden');
    if (simFinalSummaryView) simFinalSummaryView.classList.add('hidden');

    if (scenarioYearTag) scenarioYearTag.textContent = `BỐI CẢNH ${data.scenario.year}`;
    if (scenarioIndexTag) scenarioIndexTag.textContent = `Kịch bản ${data.scenarioIndex + 1}/${totalScenarios}`;
    if (scenarioTitle) scenarioTitle.textContent = data.scenario.title;
    if (scenarioContext) scenarioContext.textContent = data.scenario.context;
    if (scenarioProblem) scenarioProblem.textContent = data.scenario.problem;

    const opts = data.scenario.options;
    if (optionAText) optionAText.textContent = opts[0] ? opts[0].text : '';
    if (optionBText) optionBText.textContent = opts[1] ? opts[1].text : '';
    if (optionCText) optionCText.textContent = opts[2] ? opts[2].text : '';

    if (totalVotesBadge) totalVotesBadge.textContent = '0 Phiếu';
    if (barA) barA.style.width = '0%';
    if (barB) barB.style.width = '0%';
    if (barC) barC.style.width = '0%';
    if (pctA) pctA.textContent = '0%';
    if (pctB) pctB.textContent = '0%';
    if (pctC) pctC.textContent = '0%';

    if (startScenarioBtn) startScenarioBtn.classList.add('hidden');
    if (revealOutcomeBtn) revealOutcomeBtn.classList.remove('hidden');
    if (nextScenarioBtn) nextScenarioBtn.classList.add('hidden');
    if (votingStatusText) votingStatusText.textContent = `Đang mở bình chọn cho bối cảnh ${data.scenario.year}...`;

    updateSimTimelineNodes(currentScenarioIndex);
  });

  socket.on('host:vote_update', (data) => {
    if (totalVotesBadge) totalVotesBadge.textContent = `${data.totalVotes} / ${data.totalPlayers} Phiếu`;
    if (barA) barA.style.width = `${data.percentages.A}%`;
    if (barB) barB.style.width = `${data.percentages.B}%`;
    if (barC) barC.style.width = `${data.percentages.C}%`;
    if (pctA) pctA.textContent = `${data.percentages.A}%`;
    if (pctB) pctB.textContent = `${data.percentages.B}%`;
    if (pctC) pctC.textContent = `${data.percentages.C}%`;
  });

  socket.on('scenario:outcome', (data) => {
    SoundEngine.playOutcomeReveal();
    updateMetricsUI(data.newMetrics, data.newInflation);

    const optId = data.winningOptionId;
    if (outcomeWinnerTitle) outcomeWinnerTitle.textContent = `Quyết Sách ${optId} Được Đa Số Thông Qua (${data.votePercentages[optId]}%)!`;
    
    if (gdpImpactTag) {
      gdpImpactTag.textContent = (data.impact.economyGDP >= 0 ? '+' : '') + data.impact.economyGDP;
      gdpImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.economyGDP >= 0 ? 'text-emerald-400' : 'text-red-400'}`;
    }

    if (qolImpactTag) {
      qolImpactTag.textContent = (data.impact.qualityOfLife >= 0 ? '+' : '') + data.impact.qualityOfLife;
      qolImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.qualityOfLife >= 0 ? 'text-emerald-400' : 'text-red-400'}`;
    }

    if (statusImpactTag) {
      statusImpactTag.textContent = (data.impact.globalStatus >= 0 ? '+' : '') + data.impact.globalStatus;
      statusImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.globalStatus >= 0 ? 'text-emerald-400' : 'text-red-400'}`;
    }

    if (inflationImpactTag) {
      inflationImpactTag.textContent = (data.impact.inflationRate > 0 ? '+' : '') + data.impact.inflationRate + '%';
      inflationImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.inflationRate <= 0 ? 'text-sky-400' : 'text-red-400'}`;
    }

    if (historicalFeedbackText) historicalFeedbackText.textContent = data.winningOption.feedback;
    if (textbookCitation) textbookCitation.textContent = data.scenario.citation || "Giáo trình Lịch sử Đảng cộng sản Việt Nam";

    if (data.milestoneUnlocked && milestoneContainer) {
      if (milestoneTitle) milestoneTitle.textContent = data.milestoneUnlocked;
      milestoneContainer.classList.remove('hidden');
      if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else if (milestoneContainer) {
      milestoneContainer.classList.add('hidden');
    }

    if (outcomeModal) outcomeModal.classList.remove('hidden');
    if (revealOutcomeBtn) revealOutcomeBtn.classList.add('hidden');
    if (nextScenarioBtn) nextScenarioBtn.remove('hidden');
    if (votingStatusText) votingStatusText.textContent = `Đã chốt quyết sách ${data.scenario.year}. Hãy nhấn Tiếp Theo!`;
  });

  socket.on('game:ended', (data) => {
    SoundEngine.playFanfare();
    if (window.confetti) confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });

    if (simGameView) simGameView.classList.add('hidden');
    if (outcomeModal) outcomeModal.classList.add('hidden');
    if (simFinalSummaryView) simFinalSummaryView.classList.remove('hidden');

    const finalTitle = document.getElementById('finalTitleRating');
    const finalSummary = document.getElementById('finalSummaryText');
    if (finalTitle) finalTitle.textContent = data.titleRating;
    if (finalSummary) finalSummary.textContent = data.summaryText;

    const fGdp = document.getElementById('finalGdp');
    const fQol = document.getElementById('finalQol');
    const fStatus = document.getElementById('finalStatus');
    const fInflation = document.getElementById('finalInflation');
    if (fGdp) fGdp.textContent = `${data.finalMetrics.economyGDP}/100`;
    if (fQol) fQol.textContent = `${data.finalMetrics.qualityOfLife}/100`;
    if (fStatus) fStatus.textContent = `${data.finalMetrics.globalStatus}/100`;
    if (fInflation) fInflation.textContent = `${data.finalInflation}%`;

    const milestonesList = document.getElementById('finalMilestonesList');
    if (milestonesList) {
      if (data.unlockedMilestones && data.unlockedMilestones.length > 0) {
        milestonesList.innerHTML = data.unlockedMilestones.map(m => `
          <div class="bg-slate-900 border border-amber-500/40 rounded-xl p-3 flex items-center space-x-3">
            <i class="fa-solid fa-award text-amber-400 text-2xl shrink-0"></i>
            <span class="font-bold text-xs text-amber-200">${m}</span>
          </div>
        `).join('');
      } else {
        milestonesList.innerHTML = `<span class="text-slate-400 italic text-xs">Chưa đạt được cột mốc đặc biệt.</span>`;
      }
    }
  });

  socket.on('game:restarted', (data) => {
    currentScenarioIndex = 0;
    if (simFinalSummaryView) simFinalSummaryView.classList.add('hidden');
    if (simGameView) simGameView.classList.remove('hidden');
    if (startScenarioBtn) startScenarioBtn.classList.remove('hidden');
    if (revealOutcomeBtn) revealOutcomeBtn.classList.add('hidden');
    if (nextScenarioBtn) nextScenarioBtn.classList.add('hidden');
    if (votingStatusText) votingStatusText.textContent = 'Đã khởi động lại. Nhấn Mở Bình Chọn!';
    updateMetricsUI(data.gameState.metrics, data.gameState.inflationRate);
    updateSimTimelineNodes(0);
  });

  // Helper UI Updater Functions
  function updateMetricsUI(metrics, inflationRate) {
    if (gdpValDisplay) gdpValDisplay.textContent = `${metrics.economyGDP}/100`;
    if (gdpBar) gdpBar.style.width = `${metrics.economyGDP}%`;

    if (qolValDisplay) qolValDisplay.textContent = `${metrics.qualityOfLife}/100`;
    if (qolBar) qolBar.style.width = `${metrics.qualityOfLife}%`;

    if (statusValDisplay) statusValDisplay.textContent = `${metrics.globalStatus}/100`;
    if (statusBar) statusBar.style.width = `${metrics.globalStatus}%`;

    if (inflationValDisplay) inflationValDisplay.textContent = `${inflationRate}%`;

    if (inflationBadge && inflationValDisplay && inflationCard) {
      if (inflationRate > 100) {
        inflationBadge.textContent = 'Siêu Lạm Phát';
        inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse';
        inflationValDisplay.className = 'font-mono text-xl font-black text-red-400';
        inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-red-500/50 flex flex-col justify-between shadow-red-900/20 shadow-lg';
      } else if (inflationRate > 15) {
        inflationBadge.textContent = 'Lạm Phát Cao';
        inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800';
        inflationValDisplay.className = 'font-mono text-xl font-black text-amber-400';
        inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-amber-500/50 flex flex-col justify-between shadow-amber-900/20 shadow-lg';
      } else {
        inflationBadge.textContent = 'Kiểm Soát An Toàn';
        inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800';
        inflationValDisplay.className = 'font-mono text-xl font-black text-emerald-400';
        inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-emerald-500/40 flex flex-col justify-between shadow-emerald-900/20 shadow-lg';
      }
    }
  }

  function updateSimTimelineNodes(activeIndex) {
    const simTimelineProgress = document.getElementById('simTimelineProgress');
    if (!simTimelineProgress) return;
    const totalNodes = 7;
    const progressPct = Math.round((activeIndex / (totalNodes - 1)) * 100);
    simTimelineProgress.style.width = `${progressPct}%`;

    for (let i = 0; i < totalNodes; i++) {
      const nodeEl = document.getElementById(`simNode-${i}`);
      if (!nodeEl) continue;
      if (i < activeIndex) {
        nodeEl.className = 'w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center font-extrabold text-[11px] text-white shadow-lg';
      } else if (i === activeIndex) {
        nodeEl.className = 'w-8 h-8 rounded-full bg-red-600 border-2 border-amber-400 flex items-center justify-center font-extrabold text-[11px] text-amber-300 shadow-lg animate-pulse';
      } else {
        nodeEl.className = 'w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-extrabold text-[11px] text-slate-400';
      }
    }
  }

  // Expose openArticleModal globally for inline onclick handlers
  window.openArticleModal = openArticleModal;

  // Document-level event delegation for article cards
  document.addEventListener('click', (e) => {
    // If click originates from an explicit external source link (target="_blank"), do not open modal
    if (e.target.closest('a[target="_blank"]')) return;

    const articleCard = e.target.closest('article[data-article-id]');
    if (articleCard) {
      const articleId = articleCard.getAttribute('data-article-id');
      if (articleId) {
        if (window.SoundEngine) SoundEngine.playClick();
        openArticleModal(articleId);
      }
    }
  });

  async function openArticleModal(id) {
    const articleModal = document.getElementById('articleModal');
    const closeArticleModalBtn = document.getElementById('closeArticleModalBtn');
    const articleCategoryBadge = document.getElementById('articleCategoryBadge');
    const articleModalTitle = document.getElementById('articleModalTitle');
    const articleTextContent = document.getElementById('articleTextContent');
    const articleGalleryContainer = document.getElementById('articleGalleryContainer');
    const articleImagesGrid = document.getElementById('articleImagesGrid');
    const articleSourceBtn = document.getElementById('articleSourceBtn');

    if (!articleModal) return;

    // Show modal loading state
    if (articleModalTitle) articleModalTitle.textContent = "Đang tải nội dung bài viết...";
    if (articleTextContent) articleTextContent.innerHTML = `<div class="text-center py-8 text-slate-400 italic"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải dữ liệu báo chí & văn kiện...</div>`;
    if (articleGalleryContainer) articleGalleryContainer.classList.add('hidden');
    if (articleImagesGrid) articleImagesGrid.innerHTML = '';
    
    articleModal.classList.remove('hidden');

    try {
      const res = await fetch(`/api/articles/${id}`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu bài viết");

      const data = await res.json();

      if (articleCategoryBadge) articleCategoryBadge.textContent = data.category || `CHUYÊN ĐỀ 0${id}`;
      if (articleModalTitle) articleModalTitle.textContent = data.title || `Chuyên đề ${id}`;

      // Format text content into paragraphs
      if (articleTextContent && data.content) {
        const paragraphs = data.content
          .split(/\n\s*\n/)
          .map(p => p.trim())
          .filter(p => p.length > 0)
          .map(p => `<p class="mb-4 leading-relaxed text-slate-300">${escapeHtml(p)}</p>`)
          .join('');
        articleTextContent.innerHTML = paragraphs;
      }

      // Render image gallery if images exist
      if (data.images && data.images.length > 0 && articleImagesGrid && articleGalleryContainer) {
        articleImagesGrid.innerHTML = data.images.map(imgUrl => `
          <div class="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer shadow">
            <img src="${imgUrl}" alt="Tư liệu" class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
            <a href="${imgUrl}" target="_blank" class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
              <i class="fa-solid fa-expand"></i><span>Phóng to</span>
            </a>
          </div>
        `).join('');
        articleGalleryContainer.classList.remove('hidden');
      }

      // Set source link
      if (articleSourceBtn) {
        if (data.sourceUrl) {
          articleSourceBtn.href = data.sourceUrl;
          articleSourceBtn.classList.remove('pointer-events-none', 'opacity-50');
        } else {
          articleSourceBtn.href = '#';
          articleSourceBtn.classList.add('pointer-events-none', 'opacity-50');
        }
      }

    } catch (err) {
      console.error("Error opening article modal:", err);
      if (articleTextContent) {
        articleTextContent.innerHTML = `<div class="text-center py-6 text-red-400">Không thể tải nội dung bài viết. Vui lòng thử lại sau.</div>`;
      }
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Close Article Modal Listeners
  if (closeArticleModalBtn) {
    closeArticleModalBtn.addEventListener('click', () => {
      if (window.SoundEngine && typeof SoundEngine.playClick === 'function') { try { SoundEngine.playClick(); } catch (e) {} }
      if (articleModal) articleModal.classList.add('hidden');
    });
  }

  if (articleModal) {
    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) {
        if (window.SoundEngine && typeof SoundEngine.playClick === 'function') { try { SoundEngine.playClick(); } catch (e) {} }
        articleModal.classList.add('hidden');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && articleModal && !articleModal.classList.contains('hidden')) {
      articleModal.classList.add('hidden');
    }
  });
});
