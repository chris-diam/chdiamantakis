import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import authRoutes from './routes/auth.js';
import { authenticateSocket } from './middleware/auth.js';
import User from './models/User.js';
import './config/passport.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://chris-diam.github.io',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokemon-world')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Store connected players
const players = new Map();

// Socket.io connection handling
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.user.username} (${socket.id})`);

  // Add player to the game
  const playerData = {
    id: socket.id,
    odId: socket.user._id.toString(),
    username: socket.user.username,
    character: socket.user.character,
    position: socket.user.lastPosition || { x: 400, y: 300 },
    direction: 'down',
    isMoving: false,
  };

  players.set(socket.id, playerData);

  // Send current player their data
  socket.emit('player-init', {
    player: playerData,
    otherPlayers: Array.from(players.values()).filter(p => p.id !== socket.id),
  });

  // Broadcast to others that a new player joined
  socket.broadcast.emit('player-joined', playerData);

  // Handle player movement
  socket.on('player-move', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.direction = data.direction;
      player.isMoving = data.isMoving;
      players.set(socket.id, player);

      // Broadcast to all other players
      socket.broadcast.emit('player-moved', {
        id: socket.id,
        position: data.position,
        direction: data.direction,
        isMoving: data.isMoving,
      });
    }
  });

  // Handle player stopped moving
  socket.on('player-stop', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.isMoving = false;
      player.direction = data.direction;
      players.set(socket.id, player);

      socket.broadcast.emit('player-stopped', {
        id: socket.id,
        direction: data.direction,
      });
    }
  });

  // Handle character customization update
  socket.on('update-character', async (characterData) => {
    const player = players.get(socket.id);
    if (player) {
      player.character = characterData;
      players.set(socket.id, player);

      // Save to database
      try {
        await User.findByIdAndUpdate(socket.user._id, { character: characterData });
      } catch (err) {
        console.error('Error saving character:', err);
      }

      // Broadcast to others
      socket.broadcast.emit('player-updated', {
        id: socket.id,
        character: characterData,
      });
    }
  });

  // Handle chat messages
  socket.on('chat-message', (message) => {
    const sanitizedMessage = message.slice(0, 100); // Limit message length

    // Send to chat log
    io.emit('chat-message', {
      id: socket.id,
      username: players.get(socket.id)?.username || 'Unknown',
      message: sanitizedMessage,
      timestamp: Date.now(),
    });

    // Broadcast chat bubble to other players
    socket.broadcast.emit('player-chat', {
      id: socket.id,
      message: sanitizedMessage,
    });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`Player disconnected: ${socket.user.username} (${socket.id})`);

    // Save last position to database
    const player = players.get(socket.id);
    if (player) {
      try {
        await User.findByIdAndUpdate(socket.user._id, {
          lastPosition: player.position,
        });
      } catch (err) {
        console.error('Error saving position:', err);
      }
    }

    players.delete(socket.id);
    io.emit('player-left', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
