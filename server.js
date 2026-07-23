const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const path = require('path');
const os = require('os');
const cors = require('cors');

const SCENARIOS = require('./data/scenarios');

const app = express();
const server = http.createServer(app);

// Socket.io with wildcard CORS for Cloudflare Tunnel & local network access
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

// Helper to get local network IP address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3000;
const HOST_IP = getLocalIp();

// In-memory store for active room state
const rooms = {};

function createInitialGameState() {
  return {
    year: 1986,
    metrics: {
      economyGDP: 50,
      qualityOfLife: 30,
      globalStatus: 20
    },
    inflationRate: 774.7,
    currentScenarioIndex: 0,
    votingState: "IDLE", // IDLE, VOTING, RESULT, END_GAME
    unlockedMilestones: [],
    history: []
  };
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Host creates a room
  socket.on('host:create_room', async () => {
    const roomId = 'DM-' + Math.floor(1000 + Math.random() * 9000);
    const joinUrl = `http://${HOST_IP}:${PORT}/player.html?room=${roomId}`;
    
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(joinUrl, { margin: 2, width: 250 });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }

    rooms[roomId] = {
      roomId,
      hostSocketId: socket.id,
      players: {}, // socketId -> { nickname, avatar, score, currentVote }
      gameState: createInitialGameState()
    };

    socket.join(roomId);
    socket.emit('room_created', {
      roomId,
      joinUrl,
      qrCodeDataUrl,
      hostIp: HOST_IP,
      port: PORT,
      gameState: rooms[roomId].gameState,
      scenariosCount: SCENARIOS.length
    });

    console.log(`[Host] Created room: ${roomId} at ${joinUrl}`);
  });

  // Player joins room
  socket.on('player:join', ({ roomId, nickname, avatar }) => {
    const roomKey = Object.keys(rooms).find(r => r.toUpperCase() === (roomId || '').toUpperCase());
    const room = rooms[roomKey];

    if (!room) {
      return socket.emit('player:join_error', { message: 'Mã phòng không tồn tại hoặc đã đóng!' });
    }

    const cleanNick = (nickname || 'Cố vấn').trim();
    room.players[socket.id] = {
      socketId: socket.id,
      nickname: cleanNick,
      avatar: avatar || '⭐',
      score: 0,
      currentVote: null
    };

    socket.join(roomKey);

    socket.emit('player:joined_success', {
      roomId: roomKey,
      player: room.players[socket.id],
      gameState: room.gameState,
      currentScenario: room.gameState.votingState !== 'IDLE' ? SCENARIOS[room.gameState.currentScenarioIndex] : null
    });

    // Update host player list
    const playerList = Object.values(room.players)
      .map(p => ({ nickname: p.nickname, score: p.score, avatar: p.avatar }))
      .sort((a, b) => b.score - a.score);

    io.to(room.hostSocketId).emit('host:player_list_updated', {
      playersCount: playerList.length,
      players: playerList
    });

    console.log(`[Player] ${cleanNick} joined room ${roomKey}`);
  });

  // Host starts the game / first scenario
  socket.on('host:start_game', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.gameState.currentScenarioIndex = 0;
    room.gameState.votingState = "VOTING";
    const currentScenario = SCENARIOS[0];
    room.gameState.year = currentScenario.year;

    // Reset player votes
    Object.values(room.players).forEach(p => p.currentVote = null);

    io.to(roomId).emit('scenario:started', {
      scenarioIndex: 0,
      scenario: currentScenario,
      gameState: room.gameState,
      totalScenarios: SCENARIOS.length
    });

    console.log(`[Game] Room ${roomId} started Scenario 1 (${currentScenario.year})`);
  });

  // Player casts vote
  socket.on('player:cast_vote', ({ roomId, scenarioIndex, optionId }) => {
    const room = rooms[roomId];
    if (!room || room.gameState.votingState !== 'VOTING') return;

    const player = room.players[socket.id];
    if (!player) return;

    player.currentVote = optionId;

    socket.emit('player:vote_acknowledged', { optionId });

    // Aggregate votes for host
    const voteCounts = { A: 0, B: 0, C: 0 };
    let totalVotes = 0;
    Object.values(room.players).forEach(p => {
      if (p.currentVote && voteCounts[p.currentVote] !== undefined) {
        voteCounts[p.currentVote]++;
        totalVotes++;
      }
    });

    const percentages = {
      A: totalVotes > 0 ? Math.round((voteCounts.A / totalVotes) * 100) : 0,
      B: totalVotes > 0 ? Math.round((voteCounts.B / totalVotes) * 100) : 0,
      C: totalVotes > 0 ? Math.round((voteCounts.C / totalVotes) * 100) : 0
    };

    io.to(room.hostSocketId).emit('host:vote_update', {
      totalVotes,
      totalPlayers: Object.keys(room.players).length,
      counts: voteCounts,
      percentages
    });
  });

  // Host reveals outcome
  socket.on('host:reveal_outcome', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.gameState.votingState !== 'VOTING') return;

    const currentScenario = SCENARIOS[room.gameState.currentScenarioIndex];

    // Determine majority vote
    const voteCounts = { A: 0, B: 0, C: 0 };
    let totalVotes = 0;
    Object.values(room.players).forEach(p => {
      if (p.currentVote && voteCounts[p.currentVote] !== undefined) {
        voteCounts[p.currentVote]++;
        totalVotes++;
      }
    });

    let winningOptionId = 'B';
    if (totalVotes === 0) {
      // Default to historically correct option if no votes cast
      const correctOpt = currentScenario.options.find(o => o.isCorrect);
      winningOptionId = correctOpt ? correctOpt.id : 'B';
    } else {
      let maxVotes = -1;
      ['A', 'B', 'C'].forEach(optKey => {
        if (voteCounts[optKey] > maxVotes) {
          maxVotes = voteCounts[optKey];
          winningOptionId = optKey;
        } else if (voteCounts[optKey] === maxVotes && maxVotes > 0) {
          const optObj = currentScenario.options.find(o => o.id === optKey);
          if (optObj && optObj.isCorrect) {
            winningOptionId = optKey;
          }
        }
      });
    }

    const selectedOption = currentScenario.options.find(o => o.id === winningOptionId) || currentScenario.options[1];
    const impact = selectedOption.impact;

    // Apply state metric deltas
    const prevMetrics = { ...room.gameState.metrics };
    const prevInflation = room.gameState.inflationRate;

    room.gameState.metrics.economyGDP = Math.min(100, Math.max(0, room.gameState.metrics.economyGDP + impact.economyGDP));
    room.gameState.metrics.qualityOfLife = Math.min(100, Math.max(0, room.gameState.metrics.qualityOfLife + impact.qualityOfLife));
    room.gameState.metrics.globalStatus = Math.min(100, Math.max(0, room.gameState.metrics.globalStatus + impact.globalStatus));
    room.gameState.inflationRate = Math.max(2.5, +(room.gameState.inflationRate + impact.inflationRate).toFixed(1));

    // Milestone unlocking
    let milestoneUnlocked = null;
    if (selectedOption.isCorrect && currentScenario.milestone) {
      if (!room.gameState.unlockedMilestones.includes(currentScenario.milestone)) {
        room.gameState.unlockedMilestones.push(currentScenario.milestone);
        milestoneUnlocked = currentScenario.milestone;
      }
    }

    // Award player points & notify each player socket
    Object.values(room.players).forEach(p => {
      let pointsEarned = 0;
      if (p.currentVote === winningOptionId) {
        pointsEarned = 100;
      } else if (p.currentVote) {
        pointsEarned = 30;
      }
      p.score += pointsEarned;

      io.to(p.socketId).emit('player:score_updated', {
        score: p.score,
        pointsEarned,
        winningOptionId
      });
    });

    room.gameState.history.push({
      scenarioId: currentScenario.id,
      year: currentScenario.year,
      title: currentScenario.title,
      winningOptionId,
      winningOptionText: selectedOption.text,
      isCorrect: selectedOption.isCorrect,
      impact,
      deltas: {
        economyGDP: impact.economyGDP,
        qualityOfLife: impact.qualityOfLife,
        globalStatus: impact.globalStatus,
        inflationRate: impact.inflationRate
      }
    });

    room.gameState.votingState = "RESULT";

    const votePercentages = {
      A: totalVotes > 0 ? Math.round((voteCounts.A / totalVotes) * 100) : 0,
      B: totalVotes > 0 ? Math.round((voteCounts.B / totalVotes) * 100) : 0,
      C: totalVotes > 0 ? Math.round((voteCounts.C / totalVotes) * 100) : 0
    };

    const fullLeaderboard = Object.values(room.players)
      .map(p => ({ nickname: p.nickname, score: p.score, avatar: p.avatar }))
      .sort((a, b) => b.score - a.score);

    // Update host player list
    io.to(room.hostSocketId).emit('host:player_list_updated', {
      playersCount: fullLeaderboard.length,
      players: fullLeaderboard
    });

    io.to(roomId).emit('scenario:outcome', {
      scenario: currentScenario,
      winningOption: selectedOption,
      winningOptionId,
      voteCounts,
      votePercentages,
      totalVotes,
      prevMetrics,
      prevInflation,
      newMetrics: room.gameState.metrics,
      newInflation: room.gameState.inflationRate,
      impact,
      milestoneUnlocked,
      gameState: room.gameState,
      leaderboard: fullLeaderboard.slice(0, 10)
    });

    console.log(`[Game] Scenario ${currentScenario.year} revealed. Winning Option: ${winningOptionId}`);
  });

  // Host advances to next scenario
  socket.on('host:next_scenario', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    const nextIndex = room.gameState.currentScenarioIndex + 1;

    if (nextIndex >= SCENARIOS.length) {
      // Game Over -> Final Summary Screen
      room.gameState.votingState = "END_GAME";

      const { economyGDP, qualityOfLife, globalStatus } = room.gameState.metrics;
      const totalScore = economyGDP + qualityOfLife + globalStatus;
      
      let titleRating = "Nhà Lãnh Đạo Tiên Phong Đổi Mới";
      let summaryText = "Dưới sự chỉ đạo sáng suốt và đồng lòng của Hội đồng Chiến lược, đất nước Việt Nam đã trải qua 35 năm Đổi mới đầy tự hào, phát triển toàn diện về kinh tế, xã hội và uy tín quốc tế.";
      if (totalScore >= 240) {
        titleRating = "Kiến Trúc Sư Đổi Mới Xuất Sắc";
        summaryText = "Xuất sắc! Các quyết sách vô cùng nhạy bén, kế thừa trọn vẹn tinh thần Nghị quyết Đại hội Đảng, đưa Việt Nam vươn mình trở thành cường quốc phát triển vững chắc!";
      } else if (totalScore < 150) {
        titleRating = "Hội Đồng Cải Cách Cần Cố Gắng";
        summaryText = "Một số quyết định chưa thực sự tối ưu khiến tiến trình Đổi mới gặp thách thức, tuy nhiên những bài học lịch sử rút ra là nền tảng vô giá cho tương lai.";
      }

      const leaderboard = Object.values(room.players)
        .sort((a, b) => b.score - a.score)
        .map(p => ({ nickname: p.nickname, score: p.score, avatar: p.avatar }));

      io.to(roomId).emit('game:ended', {
        gameState: room.gameState,
        finalMetrics: room.gameState.metrics,
        finalInflation: room.gameState.inflationRate,
        unlockedMilestones: room.gameState.unlockedMilestones,
        history: room.gameState.history,
        titleRating,
        summaryText,
        leaderboard
      });

      console.log(`[Game] Room ${roomId} ended game session.`);
    } else {
      room.gameState.currentScenarioIndex = nextIndex;
      room.gameState.votingState = "VOTING";
      const currentScenario = SCENARIOS[nextIndex];
      room.gameState.year = currentScenario.year;

      Object.values(room.players).forEach(p => p.currentVote = null);

      io.to(roomId).emit('scenario:started', {
        scenarioIndex: nextIndex,
        scenario: currentScenario,
        gameState: room.gameState,
        totalScenarios: SCENARIOS.length
      });

      console.log(`[Game] Room ${roomId} advanced to Scenario ${nextIndex + 1} (${currentScenario.year})`);
    }
  });

  // Host restarts game
  socket.on('host:restart_game', ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    room.gameState = createInitialGameState();
    Object.values(room.players).forEach(p => {
      p.score = 0;
      p.currentVote = null;
    });

    socket.emit('game:restarted', {
      gameState: room.gameState
    });
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        const playerList = Object.values(room.players)
          .map(p => ({ nickname: p.nickname, score: p.score, avatar: p.avatar }))
          .sort((a, b) => b.score - a.score);

        io.to(room.hostSocketId).emit('host:player_list_updated', {
          playersCount: playerList.length,
          players: playerList
        });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🏛️  TRIỂN LÃM SỐ & MÔ PHỎNG QUYẾT SÁCH ĐỔI MỚI (1986 - 2021)`);
  console.log(`---------------------------------------------------`);
  console.log(`👉 Museum & Host Hub : http://localhost:${PORT}/`);
  console.log(`👉 Player Access     : http://${HOST_IP}:${PORT}/player`);
  console.log(`===================================================`);
});
