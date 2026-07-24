// Host View Logic - Socket.io Controller
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  let roomId = null;
  let currentScenarioIndex = 0;
  let totalScenarios = 7;
  let currentScenarioData = null;

  // DOM Elements
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
  const inflationDiff = document.getElementById('inflationDiff');

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

  // Modal Outcome DOM
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

  // Views
  const gameView = document.getElementById('gameView');
  const finalSummaryView = document.getElementById('finalSummaryView');

  // Timeline DOM
  const timelineProgress = document.getElementById('timelineProgress');

  // Initial socket room creation
  socket.emit('host:create_room', { origin: window.location.origin });

  socket.on('room_created', (data) => {
    roomId = data.roomId;
    totalScenarios = data.scenariosCount || 7;
    displayRoomId.textContent = roomId;
    qrCodeImg.src = data.qrCodeDataUrl;
    qrJoinUrlText.textContent = data.joinUrl;
    updateMetricsUI(data.gameState.metrics, data.gameState.inflationRate);
  });

  socket.on('host:player_list_updated', (data) => {
    playerCountDisplay.textContent = data.playersCount;
    if (data.players && data.players.length > 0) {
      topPlayersList.innerHTML = data.players.map(p => `
        <span class="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
          <span>${p.avatar || '⭐'}</span>
          <span>${p.nickname}</span>
          <span class="text-flagGold text-[10px]">(${p.score}đ)</span>
        </span>
      `).join('');
    } else {
      topPlayersList.innerHTML = `<span class="text-slate-500 italic">Đang chờ thành viên tham gia...</span>`;
    }
  });

  // UI Event Listeners
  toggleQrBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    qrModal.classList.remove('hidden');
  });

  closeQrModalBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    qrModal.classList.add('hidden');
  });

  closeOutcomeModalBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    outcomeModal.classList.add('hidden');
  });

  modalContinueBtn.addEventListener('click', () => {
    if (window.SoundEngine && typeof SoundEngine.playClick === 'function') { try { SoundEngine.playClick(); } catch(e){} }
    outcomeModal.classList.add('hidden');
    if (roomId) {
      socket.emit('host:next_scenario', { roomId });
    }
  });

  startScenarioBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    if (roomId) {
      socket.emit('host:start_game', { roomId });
    }
  });

  revealOutcomeBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    if (roomId) {
      socket.emit('host:reveal_outcome', { roomId });
    }
  });

  if (nextScenarioBtn) {
    nextScenarioBtn.addEventListener('click', () => {
      SoundEngine.playClick();
      if (roomId) {
        socket.emit('host:next_scenario', { roomId });
      }
    });
  }

  restartGameBtn.addEventListener('click', () => {
    SoundEngine.playClick();
    if (roomId) {
      socket.emit('host:restart_game', { roomId });
    }
  });

  // Game Socket Events
  socket.on('scenario:started', (data) => {
    SoundEngine.playClick();
    currentScenarioIndex = data.scenarioIndex;
    currentScenarioData = data.scenario;

    // Reset modals & views
    outcomeModal.classList.add('hidden');
    gameView.classList.remove('hidden');
    finalSummaryView.classList.add('hidden');

    // Update scenario details
    scenarioYearTag.textContent = `BỐI CẢNH ${data.scenario.year}`;
    scenarioIndexTag.textContent = `Kịch bản ${data.scenarioIndex + 1}/${totalScenarios}`;
    scenarioTitle.textContent = data.scenario.title;
    scenarioContext.textContent = data.scenario.context;
    scenarioProblem.textContent = data.scenario.problem;

    // Update options text
    const opts = data.scenario.options;
    optionAText.textContent = opts[0] ? opts[0].text : '';
    optionBText.textContent = opts[1] ? opts[1].text : '';
    optionCText.textContent = opts[2] ? opts[2].text : '';

    // Reset votes display
    totalVotesBadge.textContent = '0 Phiếu';
    barA.style.width = '0%';
    barB.style.width = '0%';
    barC.style.width = '0%';
    pctA.textContent = '0%';
    pctB.textContent = '0%';
    pctC.textContent = '0%';

    // Control buttons toggle
    startScenarioBtn.classList.add('hidden');
    revealOutcomeBtn.classList.remove('hidden');
    nextScenarioBtn.classList.add('hidden');
    votingStatusText.textContent = `Đang mở bình chọn cho bối cảnh ${data.scenario.year}...`;

    // Timeline bar update
    updateTimelineNodes(currentScenarioIndex);
  });

  socket.on('host:vote_update', (data) => {
    totalVotesBadge.textContent = `${data.totalVotes} / ${data.totalPlayers} Phiếu`;
    barA.style.width = `${data.percentages.A}%`;
    barB.style.width = `${data.percentages.B}%`;
    barC.style.width = `${data.percentages.C}%`;
    pctA.textContent = `${data.percentages.A}%`;
    pctB.textContent = `${data.percentages.B}%`;
    pctC.textContent = `${data.percentages.C}%`;
  });

  socket.on('scenario:outcome', (data) => {
    SoundEngine.playOutcomeReveal();

    // Update metrics UI
    updateMetricsUI(data.newMetrics, data.newInflation);

    // Populate outcome modal
    const optId = data.winningOptionId;
    outcomeWinnerTitle.textContent = `Quyết Sách ${optId} Được Đa Số Thông Qua (${data.votePercentages[optId]}%)!`;
    
    // Impact Tags
    gdpImpactTag.textContent = (data.impact.economyGDP >= 0 ? '+' : '') + data.impact.economyGDP;
    gdpImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.economyGDP >= 0 ? 'text-emerald-400' : 'text-red-400'}`;

    qolImpactTag.textContent = (data.impact.qualityOfLife >= 0 ? '+' : '') + data.impact.qualityOfLife;
    qolImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.qualityOfLife >= 0 ? 'text-emerald-400' : 'text-red-400'}`;

    statusImpactTag.textContent = (data.impact.globalStatus >= 0 ? '+' : '') + data.impact.globalStatus;
    statusImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.globalStatus >= 0 ? 'text-emerald-400' : 'text-red-400'}`;

    inflationImpactTag.textContent = (data.impact.inflationRate > 0 ? '+' : '') + data.impact.inflationRate + '%';
    inflationImpactTag.className = `font-mono text-xl font-extrabold ${data.impact.inflationRate <= 0 ? 'text-sky-400' : 'text-red-400'}`;

    // Historical Feedback
    historicalFeedbackText.textContent = data.winningOption.feedback;
    textbookCitation.textContent = data.scenario.citation || "Giáo trình Lịch sử Đảng cộng sản Việt Nam";

    // Milestone Badge
    if (data.milestoneUnlocked) {
      milestoneTitle.textContent = data.milestoneUnlocked;
      milestoneContainer.classList.remove('hidden');
      if (window.confetti) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      milestoneContainer.classList.add('hidden');
    }

    // Toggle modal and control buttons
    outcomeModal.classList.remove('hidden');
    revealOutcomeBtn.classList.add('hidden');
    votingStatusText.textContent = `Đã chốt quyết sách ${data.scenario.year}. Hãy nhấn "Tiếp Tục Diễn Tiến Lịch Sử" trong bảng kết quả!`;
  });

  socket.on('game:ended', (data) => {
    SoundEngine.playFanfare();
    if (window.confetti) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
    }

    gameView.classList.add('hidden');
    outcomeModal.classList.add('hidden');
    finalSummaryView.classList.remove('hidden');

    document.getElementById('finalTitleRating').textContent = data.titleRating;
    document.getElementById('finalSummaryText').textContent = data.summaryText;

    document.getElementById('finalGdp').textContent = `${data.finalMetrics.economyGDP}/100`;
    document.getElementById('finalQol').textContent = `${data.finalMetrics.qualityOfLife}/100`;
    document.getElementById('finalStatus').textContent = `${data.finalMetrics.globalStatus}/100`;
    document.getElementById('finalInflation').textContent = `${data.finalInflation}%`;

    // Milestones List
    const milestonesList = document.getElementById('finalMilestonesList');
    if (data.unlockedMilestones && data.unlockedMilestones.length > 0) {
      milestonesList.innerHTML = data.unlockedMilestones.map(m => `
        <div class="bg-slate-900 border border-amber-500/40 rounded-xl p-3 flex items-center space-x-3">
          <i class="fa-solid fa-award text-flagGold text-2xl shrink-0"></i>
          <span class="font-bold text-xs text-amber-200">${m}</span>
        </div>
      `).join('');
    } else {
      milestonesList.innerHTML = `<span class="text-slate-400 italic text-xs">Chưa đạt được cột mốc đặc biệt.</span>`;
    }
  });

  socket.on('game:restarted', (data) => {
    currentScenarioIndex = 0;
    finalSummaryView.classList.add('hidden');
    gameView.classList.remove('hidden');
    startScenarioBtn.classList.remove('hidden');
    revealOutcomeBtn.classList.add('hidden');
    nextScenarioBtn.classList.add('hidden');
    votingStatusText.textContent = 'Đã khởi động lại. Nhấn Mở Bình Chọn!';
    updateMetricsUI(data.gameState.metrics, data.gameState.inflationRate);
    updateTimelineNodes(0);
  });

  // Helper UI Updater Functions
  function updateMetricsUI(metrics, inflationRate) {
    gdpValDisplay.textContent = `${metrics.economyGDP}/100`;
    gdpBar.style.width = `${metrics.economyGDP}%`;

    qolValDisplay.textContent = `${metrics.qualityOfLife}/100`;
    qolBar.style.width = `${metrics.qualityOfLife}%`;

    statusValDisplay.textContent = `${metrics.globalStatus}/100`;
    statusBar.style.width = `${metrics.globalStatus}%`;

    inflationValDisplay.textContent = `${inflationRate}%`;
    const inflationCard = document.getElementById('inflationCard');

    if (inflationRate > 100) {
      inflationBadge.textContent = 'Siêu Lạm Phát';
      inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800 animate-pulse';
      inflationValDisplay.className = 'font-mono text-xl font-black text-red-400';
      if (inflationCard) inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-red-500/50 flex flex-col justify-between shadow-red-900/20 shadow-lg';
    } else if (inflationRate > 15) {
      inflationBadge.textContent = 'Lạm Phát Cao';
      inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800';
      inflationValDisplay.className = 'font-mono text-xl font-black text-amber-400';
      if (inflationCard) inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-amber-500/50 flex flex-col justify-between shadow-amber-900/20 shadow-lg';
    } else {
      inflationBadge.textContent = 'Kiểm Soát An Toàn';
      inflationBadge.className = 'px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800';
      inflationValDisplay.className = 'font-mono text-xl font-black text-emerald-400';
      if (inflationCard) inflationCard.className = 'bg-slate-900/90 rounded-lg p-2.5 border border-emerald-500/40 flex flex-col justify-between shadow-emerald-900/20 shadow-lg';
    }
  }

  function updateTimelineNodes(activeIndex) {
    const totalNodes = 7;
    const progressPct = Math.round((activeIndex / (totalNodes - 1)) * 100);
    timelineProgress.style.width = `${progressPct}%`;

    for (let i = 0; i < totalNodes; i++) {
      const nodeEl = document.getElementById(`node-${i}`);
      if (!nodeEl) continue;
      if (i < activeIndex) {
        nodeEl.className = 'w-9 h-9 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center font-extrabold text-xs text-white shadow-lg';
      } else if (i === activeIndex) {
        nodeEl.className = 'w-9 h-9 rounded-full bg-flagRed border-2 border-flagGold flex items-center justify-center font-extrabold text-xs text-flagGold shadow-lg animate-pulse';
      } else {
        nodeEl.className = 'w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-extrabold text-xs text-slate-400';
      }
    }
  }
});
