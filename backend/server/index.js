// MERN Stack Application Setup

// Step 1: Initialize Backend (Node.js + Express + MongoDB)
// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite React app URL
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Schema and model
const ComponentSchema = new mongoose.Schema({
  name: String,
  consumption: Number,
  timestamp: { type: Date, default: Date.now }
});

const Component = mongoose.model('Component', ComponentSchema);

// REST API Routes
app.get('/api/components', async (req, res) => {
  try {
    const components = await Component.find();
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/components', async (req, res) => {
  try {
    const newComponent = new Component(req.body);
    await newComponent.save();
    io.emit('new-data', newComponent); // Emit new data in real time
    res.status(201).json(newComponent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
