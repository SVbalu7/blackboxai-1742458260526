import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

class SocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000; // 5 seconds
  }

  // Initialize socket connection
  initialize() {
    if (this.socket) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      withCredentials: true
    });

    this.setupEventListeners();
  }

  // Connect to socket with authentication token
  connect(token) {
    if (!this.socket) this.initialize();

    this.socket.auth = { token };
    this.socket.connect();
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.reconnectAttempts = 0;
    }
  }

  // Set up default socket event listeners
  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleConnectionError();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the client, try to reconnect
        this.socket.connect();
      }
    });

    // Handle attendance events
    this.socket.on('attendance-marked', (data) => {
      toast.success('Attendance marked successfully');
      this.notifyListeners('attendance-marked', data);
    });

    this.socket.on('attendance-updated', (data) => {
      toast.success('Attendance updated successfully');
      this.notifyListeners('attendance-updated', data);
    });

    // Handle dashboard updates
    this.socket.on('carousel-updated', (data) => {
      this.notifyListeners('carousel-updated', data);
    });

    this.socket.on('updates-changed', (data) => {
      this.notifyListeners('updates-changed', data);
    });

    // Handle user management events
    this.socket.on('faculty-subject-assigned', (data) => {
      this.notifyListeners('faculty-subject-assigned', data);
    });

    this.socket.on('student-added', (data) => {
      this.notifyListeners('student-added', data);
    });

    this.socket.on('student-updated', (data) => {
      this.notifyListeners('student-updated', data);
    });

    // Handle notifications
    this.socket.on('notification', (data) => {
      toast(data.message, {
        icon: data.icon || '📢',
        duration: data.duration || 3000
      });
      this.notifyListeners('notification', data);
    });
  }

  // Handle connection errors
  handleConnectionError() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error('Unable to connect to server. Please check your connection.');
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return cleanup function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Remove event listener
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  // Notify all listeners for an event
  notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Join a room
  joinRoom(room) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join-room', room);
    }
  }

  // Leave a room
  leaveRoom(room) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('leave-room', room);
    }
  }

  // Send attendance data
  sendAttendance(data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark-attendance', data);
    } else {
      throw new Error('Socket not connected');
    }
  }

  // Update attendance
  updateAttendance(data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('update-attendance', data);
    } else {
      throw new Error('Socket not connected');
    }
  }

  // Send message to room
  sendToRoom(room, event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('room-message', { room, event, data });
    } else {
      throw new Error('Socket not connected');
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;