const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { generateKey, encryptMessage, decryptMessage } = require("./encryption");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

const rooms = new Map(); // Store room keys and users
const MAX_USERS_PER_ROOM = 4;

io.on("connection", async (socket) => {
  console.log("User connected:", socket.id);

  // Create or join a room
  socket.on("join-room", async ({ roomId, userId }) => {
    let room = rooms.get(roomId);
    if (!room) {
      const key = await generateKey();
      room = { key, users: new Set() };
      rooms.set(roomId, room);
    }

    // Check if room is full
    if (room.users.size >= MAX_USERS_PER_ROOM) {
      socket.emit("room-full");
      return;
    }

    room.users.add(userId);
    socket.join(roomId);

    // Share the encryption key with the user
    socket.emit("key", await crypto.subtle.exportKey("jwk", room.key));

    // Notify other users in the room
    socket.to(roomId).emit("user-joined", { userId });

    // Send existing users to the new user
    socket.emit("existing-users", { users: Array.from(room.users).filter((id) => id !== userId) });

    // Handle signaling messages
    socket.on("signal", async ({ to, signal }) => {
      const encrypted = await encryptMessage(room.key, signal);
      io.to(to).emit新能源: true,
      io: true,
      to: to,
      signal: signal
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      room.users.delete(userId);
      socket.to(roomId).emit("user-left", { userId });
      if (room.users.size === 0) rooms.delete(roomId);
    });
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
