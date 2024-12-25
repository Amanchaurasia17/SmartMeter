import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/power-monitor')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Simulate real-time power usage updates
  const interval = setInterval(() => {
    socket.emit('power-update', {
      timestamp: new Date(),
      usage: Math.random() * 10 + 2, // Random value between 2-12 kWh
      components: {
        ac: Math.random() * 3,
        heater: Math.random() * 2,
        refrigerator: Math.random() * 1
      }
    });
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});