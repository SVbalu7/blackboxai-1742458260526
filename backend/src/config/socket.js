const { Server } = require('socket.io');

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    // Handle real-time updates for attendance
    socket.on('attendance-update', (data) => {
      io.emit('attendance-updated', data);
    });

    // Handle real-time updates for carousel/dashboard
    socket.on('carousel-update', (data) => {
      io.emit('carousel-updated', data);
    });

    // Handle real-time updates for student/faculty management
    socket.on('management-update', (data) => {
      io.emit('management-updated', data);
    });

    // Handle device login limitations
    socket.on('user-login', (data) => {
      io.emit('check-device-limit', data);
    });
  });

  return io;
};

module.exports = initializeSocket;