const setupSignaling = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      // Handle signaling data
      socket.on('signal', (data) => {
        io.to(data.userId).emit('signal', {
          signal: data.signal,
          userId: socket.id,
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });
  });
};

module.exports = setupSignaling;
