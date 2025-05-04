const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const setupSignaling = require('./signaling');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Basic route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Setup Socket.IO signaling
setupSignaling(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
