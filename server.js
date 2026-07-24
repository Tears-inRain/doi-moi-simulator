const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const path = require('path');
const os = require('os');
const cors = require('cors');

const fs = require('fs');

const SCENARIOS = require('./data/scenarios');

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS configuration
const ALLOWED_ORIGINS = [
  'https://vnr202.l4st-r4ven.io.vn',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin, allowed origins, or local network IPs
    if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST"],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

// Editorial Articles API Endpoint
const ARTICLE_METADATA = {
  1: {
    title: "Đêm Trước Đổi Mới & Bước Ngoặt Đại Hội VI (12/1986)",
    category: "ĐẠI HỘI VI (1986)"
  },
  2: {
    title: "Từ Quốc Gia Thiếu Ăn Đến Kỳ Tích Nông Nghiệp Tự Cấp Lương Thực (Khoán 10 - 1988)",
    category: "KHOÁN 10 (1988)"
  },
  3: {
    title: "Bản Đồ Hội Nhập Quốc Tế: Phá Bỏ Cấm Vận & Vươn Ra Biển Lớn (1995 & 2007)",
    category: "ĐỐI NGOẠI (1995 & 2007)"
  },
  4: {
    title: "Đấu Tranh Phòng, Chống Tham Nhũng: Giữ Vững Niềm Tin Của Nhân Dân (2016)",
    category: "CHỈNH ĐỐN ĐẢNG (2016)"
  }
};

app.get('/api/articles/:id', (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  if (!articleId || articleId < 1 || articleId > 4) {
    return res.status(404).json({ error: "Bài viết không tồn tại." });
  }

  const articleDir = path.join(__dirname, 'public', 'assets', 'articles', `article${articleId}`);
  const contentPath = path.join(articleDir, 'content.txt');
  const sourcePath = path.join(articleDir, 'source.txt');

  let content = "";
  let sourceUrl = "";
  let images = [];

  try {
    if (fs.existsSync(contentPath)) {
      content = fs.readFileSync(contentPath, 'utf-8');
    }
    if (fs.existsSync(sourcePath)) {
      sourceUrl = fs.readFileSync(sourcePath, 'utf-8').trim();
    }
    if (fs.existsSync(articleDir)) {
      const files = fs.readdirSync(articleDir);
      const validExts = ['.avif', '.webp', '.png', '.jpg', '.jpeg'];
      images = files
        .filter(f => validExts.includes(path.extname(f).toLowerCase()))
        .map(f => `/assets/articles/article${articleId}/${f}`);
    }

    const meta = ARTICLE_METADATA[articleId] || { title: `Chuyên đề 0${articleId}`, category: `CHUYÊN ĐỀ 0${articleId}` };

    res.json({
      id: articleId,
      title: meta.title,
      category: meta.category,
      content,
      sourceUrl,
      images
    });
  } catch (err) {
    console.error(`Error loading article ${articleId}:`, err);
    res.status(500).json({ error: "Lỗi đọc dữ liệu bài viết." });
  }
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

// Robust helper to lookup active room by ID or socket association
function getRoom(payload, socketId) {
  let cleanId = null;
  if (payload) {
    if (typeof payload === 'string') cleanId = payload;
    else if (typeof payload === 'object' && payload.roomId) cleanId = payload.roomId;
  }

  if (cleanId) {
    const key = Object.keys(rooms).find(r => r.toUpperCase() === cleanId.toString().trim().toUpperCase());
    if (key) return rooms[key];
  }

  // Fallback lookup using socketId
  if (socketId) {
    const foundByHost = Object.values(rooms).find(r => r.hostSocketId === socketId);
    if (foundByHost) return foundByHost;

    const foundByPlayer = Object.values(rooms).find(r => r.players && r.players[socketId]);
    if (foundByPlayer) return foundByPlayer;
  }

  return null;
}

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Host creates a room
  socket.on('host:create_room', async (data) => {
    const roomId = 'DM-' + Math.floor(1000 + Math.random() * 9000);
    
    // Base URL resolution order: process.env.PUBLIC_DOMAIN -> data.origin -> default public domain https://vnr202.l4st-r4ven.io.vn
    let baseUrl = process.env.PUBLIC_DOMAIN || (data && data.origin ? data.origin : 'https://vnr202.l4st-r4ven.io.vn');
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const joinUrl = `${baseUrl}/player?room=${roomId}`;
    
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
    const room = getRoom(roomId, socket.id);

    if (!room) {
      return socket.emit('player:join_error', { message: 'Mã phòng không tồn tại hoặc đã đóng!' });
    }

    const roomKey = room.roomId;
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
  socket.on('host:start_game', (payload) => {
    const room = getRoom(payload, socket.id);
    if (!room) {
      console.error(`[Game] host:start_game failed - room not found for socket ${socket.id}`);
      return;
    }

    room.gameState.currentScenarioIndex = 0;
    room.gameState.votingState = "VOTING";
    const currentScenario = SCENARIOS[0];
    room.gameState.year = currentScenario.year;

    // Reset player votes
    Object.values(room.players).forEach(p => p.currentVote = null);

    io.to(room.roomId).emit('scenario:started', {
      scenarioIndex: 0,
      scenario: currentScenario,
      gameState: room.gameState,
      totalScenarios: SCENARIOS.length
    });

    console.log(`[Game] Room ${room.roomId} started Scenario 1 (${currentScenario.year})`);
  });

  // Player casts vote
  socket.on('player:cast_vote', (payload) => {
    const { roomId, scenarioIndex, optionId } = payload || {};
    const room = getRoom(roomId, socket.id);
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
  socket.on('host:reveal_outcome', (payload) => {
    const room = getRoom(payload, socket.id);
    if (!room || room.gameState.votingState !== 'VOTING') {
      console.error(`[Game] host:reveal_outcome failed - room not found or not in VOTING state for socket ${socket.id}:`, payload);
      return;
    }

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

    io.to(room.roomId).emit('scenario:outcome', {
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

    console.log(`[Game] Scenario ${currentScenario.year} revealed in room ${room.roomId}. Winning Option: ${winningOptionId}`);
  });

  // Host advances to next scenario
  socket.on('host:next_scenario', (payload) => {
    const room = getRoom(payload, socket.id);
    if (!room) {
      console.error(`[Game] host:next_scenario failed - room not found for socket ${socket.id}:`, payload);
      return;
    }

    const nextIndex = room.gameState.currentScenarioIndex + 1;
    console.log(`[Game] Advancing room ${room.roomId} to scenario index ${nextIndex}/${SCENARIOS.length}`);

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

      io.to(room.roomId).emit('game:ended', {
        gameState: room.gameState,
        finalMetrics: room.gameState.metrics,
        finalInflation: room.gameState.inflationRate,
        unlockedMilestones: room.gameState.unlockedMilestones,
        history: room.gameState.history,
        titleRating,
        summaryText,
        leaderboard
      });

      console.log(`[Game] Room ${room.roomId} ended game session.`);
    } else {
      room.gameState.currentScenarioIndex = nextIndex;
      room.gameState.votingState = "VOTING";
      const currentScenario = SCENARIOS[nextIndex];
      room.gameState.year = currentScenario.year;

      Object.values(room.players).forEach(p => p.currentVote = null);

      io.to(room.roomId).emit('scenario:started', {
        scenarioIndex: nextIndex,
        scenario: currentScenario,
        gameState: room.gameState,
        totalScenarios: SCENARIOS.length
      });

      console.log(`[Game] Room ${room.roomId} advanced to Scenario ${nextIndex + 1} (${currentScenario.year})`);
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
