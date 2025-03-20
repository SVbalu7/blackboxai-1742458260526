import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle unauthorized errors
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle forbidden errors
    if (error.response.status === 403) {
      toast.error('You do not have permission to perform this action');
      return Promise.reject(error);
    }

    // Handle validation errors
    if (error.response.status === 422) {
      const errors = error.response.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach(err => toast.error(err));
      } else {
        toast.error('Validation error. Please check your input.');
      }
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle other errors
    const errorMessage = error.response.data.message || 'An error occurred';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Auth API calls
export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getCurrentUser: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data)
};

// Admin API calls
export const admin = {
  // Dashboard
  updateCarousel: (data) => api.put('/admin/dashboard/carousel', data),
  addUpdate: (data) => api.post('/admin/dashboard/updates', data),
  editUpdate: (id, data) => api.put(`/admin/dashboard/updates/${id}`, data),
  deleteUpdate: (id) => api.delete(`/admin/dashboard/updates/${id}`),

  // Analytics
  getAnalytics: (params) => api.get('/admin/analytics', { params }),

  // Faculty Management
  getAllFaculty: () => api.get('/admin/faculty'),
  getFacultyById: (id) => api.get(`/admin/faculty/${id}`),
  assignSubjectToFaculty: (data) => api.post('/admin/faculty/assign-subject', data),

  // Student Management
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  addStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),

  // Subject Management
  getSubjects: (params) => api.get('/admin/subjects', { params }),
  addSubject: (data) => api.post('/admin/subjects', data)
};

// Faculty API calls
export const faculty = {
  // Dashboard
  getDashboard: () => api.get('/faculty/dashboard'),
  
  // Subjects
  getAssignedSubjects: () => api.get('/faculty/subjects'),
  getStudentsBySubject: (params) => api.get('/faculty/students', { params }),

  // Attendance
  markAttendance: (data) => api.post('/faculty/attendance', data),
  editAttendance: (data) => api.put('/faculty/attendance/edit', data),
  getAttendanceRecords: (params) => api.get('/faculty/attendance', { params }),
  getAttendanceStats: (params) => api.get('/faculty/attendance/stats', { params }),

  // Profile
  updateProfile: (data) => api.put('/faculty/profile', data),
  
  // Device Management
  getDeviceStatus: () => api.get('/faculty/device-status'),
  handleDeviceLogout: (data) => api.post('/faculty/device-logout', data)
};

// Student API calls
export const student = {
  // Dashboard
  getDashboard: () => api.get('/student/dashboard'),
  
  // Analytics
  getAnalytics: (params) => api.get('/student/analytics', { params }),
  
  // Attendance
  getAttendance: (params) => api.get('/student/attendance', { params }),
  
  // Subscription
  getSubscriptionStatus: () => api.get('/student/subscription'),
  updateSubscription: (data) => api.put('/student/subscription', data),
  
  // Profile
  updateProfile: (data) => api.put('/student/profile', data),
  
  // Device Management
  getDeviceStatus: () => api.get('/student/device-status'),
  handleDeviceLogout: (data) => api.post('/student/device-logout', data)
};

// Offline support
export const offlineStorage = {
  // Store attendance data locally when offline
  storeAttendanceData: async (data) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['pendingRecords'], 'readwrite');
      const store = transaction.objectStore('pendingRecords');
      await store.add({
        data,
        timestamp: new Date().toISOString(),
        token: localStorage.getItem('token')
      });
    } catch (error) {
      console.error('Error storing offline data:', error);
    }
  },

  // Get all pending attendance records
  getPendingRecords: async () => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['pendingRecords'], 'readonly');
      const store = transaction.objectStore('pendingRecords');
      return await store.getAll();
    } catch (error) {
      console.error('Error getting pending records:', error);
      return [];
    }
  }
};

// Helper function to open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AttendanceDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingRecords')) {
        db.createObjectStore('pendingRecords', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

export default api;