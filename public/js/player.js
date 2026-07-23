// Player Mobile View Logic - Socket.io Controller
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  let roomId = null;
  let playerInfo = null;
  let currentVote = null;

  // DOM Elements - Form & Screens
  const joinScreen = document.getElementById('joinScreen');
  const waitingScreen = document.getElementById('waitingScreen');
  const votingScreen = document.getElementById('votingScreen');
  const playerOutcomeScreen = document.getElementById('playerOutcomeScreen');

  const joinForm = document.getElementById('joinForm');
  const roomIdInput = document.getElementById('roomIdInput');
  const nicknameInput = document.getElementById('nicknameInput');
  const avatarPicker = document.getElementById('avatarPicker');

  // Header Elements
  const playerAvatarDisplay = document.getElementById('playerAvatarDisplay');
  const playerNickDisplay = document.getElementById('playerNickDisplay');
  const roomCodeBadge = document.getElementById('roomCodeBadge');
  const playerScoreDisplay = document.getElementById('playerScoreDisplay');
  const waitNickName = document.getElementById('waitNickName');

  // Voting Elements
  const playerScenarioYear = document.getElementById('playerScenarioYear');
  const playerScenarioStep = document.getElementById('playerScenarioStep');
  const playerScenarioTitle = document.getElementById('playerScenarioTitle');
  const playerScenarioProblem = document.getElementById('playerScenarioProblem');

  const btnOptA = document.getElementById('btnOptA');
  const btnOptB = document.getElementById('btnOptB');
  const btnOptC = document.getElementById('btnOptC');
  const textOptA = document.getElementById('textOptA');
  const textOptB = document.getElementById('textOptB');
  const textOptC = document.getElementById('textOptC');
  const votedFeedback = document.getElementById('votedFeedback');
  const votedOptionNote = document.getElementById('votedOptionNote');

  // Outcome Elements
  const playerWinningOptionTitle = document.getElementById('playerWinningOptionTitle');
  const playerVoteResultBadge = document.getElementById('playerVoteResultBadge');
  const playerHistoricalFeedback = document.getElementById('playerHistoricalFeedback');

  let selectedAvatar = '⭐';

  // Extract room parameter from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    roomIdInput.value = roomParam.toUpperCase();
  }

  // Randomize default nickname
  const defaultNicks = ['Cố vấn Nam', 'Đại biểu Mai', 'Cố vấn Minh', 'Đại biểu Hoa', 'Cố vấn Tuấn', 'Đại biểu An'];
  nicknameInput.value = defaultNicks[Math.floor(Math.random() * defaultNicks.length)];

  // Avatar picker handler
  avatarPicker.querySelectorAll('.avatar-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      SoundEngine.playClick();
      avatarPicker.querySelectorAll('.avatar-opt').forEach(b => {
        b.classList.remove('border-flagGold');
        b.classList.add('border-transparent');
      });
      btn.classList.remove('border-transparent');
      btn.classList.add('border-flagGold');
      selectedAvatar = btn.getAttribute('data-avatar') || '⭐';
    });
  });

  // Join form submission
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    SoundEngine.playClick();

    roomId = roomIdInput.value.trim().toUpperCase();
    const nickname = nicknameInput.value.trim() || 'Cố vấn';

    socket.emit('player:join', {
      roomId,
      nickname,
      avatar: selectedAvatar
    });
  });

  // Socket event listeners
  socket.on('player:join_error', (data) => {
    alert(data.message || 'Mã phòng không hợp lệ!');
  });

  socket.on('player:joined_success', (data) => {
    SoundEngine.playVoteSuccess();
    roomId = data.roomId;
    playerInfo = data.player;

    playerNickDisplay.textContent = playerInfo.nickname;
    playerAvatarDisplay.textContent = playerInfo.avatar || '⭐';
    playerScoreDisplay.textContent = `${playerInfo.score || 0}đ`;
    roomCodeBadge.textContent = `Mã: ${roomId}`;
    waitNickName.textContent = playerInfo.nickname;

    joinScreen.classList.add('hidden');

    if (data.currentScenario) {
      setupScenarioView(data.currentScenario, data.gameState.currentScenarioIndex);
    } else {
      waitingScreen.classList.remove('hidden');
      votingScreen.classList.add('hidden');
      playerOutcomeScreen.classList.add('hidden');
    }
  });

  socket.on('scenario:started', (data) => {
    SoundEngine.playClick();
    setupScenarioView(data.scenario, data.scenarioIndex, data.totalScenarios);
  });

  function setupScenarioView(scenario, scenarioIndex, totalCount = 7) {
    currentVote = null;

    joinScreen.classList.add('hidden');
    waitingScreen.classList.add('hidden');
    playerOutcomeScreen.classList.add('hidden');
    votingScreen.classList.remove('hidden');
    votedFeedback.classList.add('hidden');

    playerScenarioYear.textContent = `NĂM ${scenario.year}`;
    playerScenarioStep.textContent = `Kịch bản ${scenarioIndex + 1}/${totalCount}`;
    playerScenarioTitle.textContent = scenario.title;
    playerScenarioProblem.textContent = scenario.problem;

    const opts = scenario.options;
    textOptA.textContent = opts[0] ? opts[0].text : '';
    textOptB.textContent = opts[1] ? opts[1].text : '';
    textOptC.textContent = opts[2] ? opts[2].text : '';

    // Reset option buttons state
    [btnOptA, btnOptB, btnOptC].forEach(b => {
      b.classList.remove('selected-option', 'opacity-60', 'pointer-events-none');
    });
  }

  // Voting buttons click listeners
  btnOptA.addEventListener('click', () => castVote('A', btnOptA));
  btnOptB.addEventListener('click', () => castVote('B', btnOptB));
  btnOptC.addEventListener('click', () => castVote('C', btnOptC));

  function castVote(optionId, targetBtn) {
    if (currentVote) return; // Prevent voting twice
    SoundEngine.playClick();

    currentVote = optionId;

    [btnOptA, btnOptB, btnOptC].forEach(b => b.classList.remove('selected-option'));
    targetBtn.classList.add('selected-option');

    socket.emit('player:cast_vote', {
      roomId,
      optionId
    });
  }

  socket.on('player:vote_acknowledged', (data) => {
    SoundEngine.playVoteSuccess();
    votedOptionNote.textContent = `Bạn đã chọn Quyết Sách ${data.optionId}. Đang chờ Host chốt kết quả...`;
    votedFeedback.classList.remove('hidden');

    // Disable buttons
    [btnOptA, btnOptB, btnOptC].forEach(b => {
      b.classList.add('opacity-60', 'pointer-events-none');
    });
  });

  socket.on('scenario:outcome', (data) => {
    SoundEngine.playOutcomeReveal();

    votingScreen.classList.add('hidden');
    playerOutcomeScreen.classList.remove('hidden');

    const winId = data.winningOptionId;
    playerWinningOptionTitle.textContent = `Quyết Sách ${winId} Được Đa Số Chọn (${data.votePercentages[winId]}%)`;
    playerHistoricalFeedback.textContent = data.winningOption.feedback;

    if (currentVote === winId) {
      playerVoteResultBadge.textContent = '🎯 Bạn Đã Chọn Đúng Phương Án Thắng (+100đ)!';
      playerVoteResultBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 mb-4';
    } else if (currentVote) {
      playerVoteResultBadge.textContent = '👍 Tham Gia Đóng Góp Ý Kiến (+30đ)';
      playerVoteResultBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-900/90 text-amber-300 border border-amber-500/40 mb-4';
    } else {
      playerVoteResultBadge.textContent = '⏳ Không Kịp Gửi Phiếu';
      playerVoteResultBadge.className = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 mb-4';
    }

    // Update score from leaderboard if available
    if (data.leaderboard && playerInfo) {
      const p = data.leaderboard.find(l => l.nickname === playerInfo.nickname);
      if (p) {
        playerScoreDisplay.textContent = `${p.score}đ`;
      }
    }
  });

  socket.on('player:score_updated', (data) => {
    if (playerInfo) {
      playerInfo.score = data.score;
    }
    playerScoreDisplay.textContent = `${data.score}đ`;
  });

  socket.on('game:ended', (data) => {
    SoundEngine.playFanfare();
    votingScreen.classList.add('hidden');
    playerOutcomeScreen.classList.remove('hidden');
    playerWinningOptionTitle.textContent = 'HÀNH TRÌNH 35 NĂM ĐỔI MỚI KẾT THÚC!';
    playerVoteResultBadge.textContent = `Danh Hiệu: ${data.titleRating}`;
    playerHistoricalFeedback.textContent = data.summaryText;
  });
});
