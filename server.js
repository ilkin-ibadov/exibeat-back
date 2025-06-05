// server.js
import express from 'express'
import mongoose from 'mongoose'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv';
dotenv.config();
import Message from './models/message.model.js';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true
}));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('chat-message', ({ to, from, trackId, content }) => {
    const message = {
      from,
      content,
      timestamp: new Date(),
      trackId,
    };

    io.to(to).emit('chat-message', message);

    // persist message in DB
    Message.create({ sender: from, recipient: to, content, track: trackId });

    console.log(`Message from ${from} to ${to}: ${content}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('io', io);

// Routes
import authRoutes from './routes/auth.route.js';
import trackRoutes from './routes/track.route.js'
import messageRoutes from './routes/message.route.js'

app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB & Start
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  server.listen(3001, () => console.log('Server running on port 3001'));
});