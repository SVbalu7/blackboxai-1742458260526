// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CURRENT_USER: '/auth/me'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    FACULTY: '/admin/faculty',
    STUDENTS: '/admin/students',
    SUBJECTS: '/admin/subjects'
  },
  FACULTY: {
    DASHBOARD: '/faculty/dashboard',
    SUBJECTS: '/faculty/subjects',
    ATTENDANCE: '/faculty/attendance',
    PROFILE: '/faculty/profile'
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    ATTENDANCE: '/student/attendance',
    ANALYTICS: '/student/analytics',
    SUBSCRIPTION: '/student/subscription'
  }
};

// Role Types
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'P',
  ABSENT: 'A',
  LEAVE: 'L'
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: 'basic',
    price: 0,
    features: [
      'Single device login',
      'Basic attendance tracking',
      'Limited analytics'
    ]
  },
  PREMIUM: {
    name: 'premium',
    price: 499,
    features: [
      'Multiple device login',
      'Advanced analytics',
      'Attendance reports',
      'Priority support'
    ]
  }
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#0ea5e9',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  SECONDARY: '#64748b',
  BACKGROUND: '#f8fafc'
};

// Chart Options
export const CHART_OPTIONS = {
  RESPONSIVE: true,
  MAINTAIN_ASPECT_RATIO: false,
  PLUGINS: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    }
  }
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM D, YYYY',
  SHORT: 'MMM D, YYYY',
  TIME: 'h:mm A',
  DAY: 'dddd',
  MONTH_YEAR: 'MMMM YYYY'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  DEVICE_ID: 'deviceId',
  PREFERENCES: 'preferences'
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Validation Rules
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
  },
  REGISTRATION_NUMBER: {
    PATTERN: /^\d{4}[A-Z]{2}\d{3}$/
  },
  EMPLOYEE_ID: {
    PATTERN: /^[A-Z]{3}\d{4}$/
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset successful!',
  ATTENDANCE_MARKED: 'Attendance marked successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    FACULTY: '/admin/faculty',
    STUDENTS: '/admin/students',
    SUBJECTS: '/admin/subjects',
    SETTINGS: '/admin/settings'
  },
  FACULTY: {
    ROOT: '/faculty',
    DASHBOARD: '/faculty/dashboard',
    ATTENDANCE: '/faculty/attendance',
    RECORDS: '/faculty/records',
    PROFILE: '/faculty/profile'
  },
  STUDENT: {
    ROOT: '/student',
    DASHBOARD: '/student/dashboard',
    ATTENDANCE: '/student/attendance',
    ANALYTICS: '/student/analytics',
    SUBSCRIPTION: '/student/subscription',
    PROFILE: '/student/profile'
  }
};

// Navigation Items
export const NAV_ITEMS = {
  ADMIN: [
    { name: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
    { name: 'Analytics', path: ROUTES.ADMIN.ANALYTICS, icon: 'analytics' },
    { name: 'Faculty', path: ROUTES.ADMIN.FACULTY, icon: 'people' },
    { name: 'Students', path: ROUTES.ADMIN.STUDENTS, icon: 'school' },
    { name: 'Subjects', path: ROUTES.ADMIN.SUBJECTS, icon: 'book' }
  ],
  FACULTY: [
    { name: 'Dashboard', path: ROUTES.FACULTY.DASHBOARD, icon: 'dashboard' },
    { name: 'Mark Attendance', path: ROUTES.FACULTY.ATTENDANCE, icon: 'check' },
    { name: 'Records', path: ROUTES.FACULTY.RECORDS, icon: 'history' }
  ],
  STUDENT: [
    { name: 'Dashboard', path: ROUTES.STUDENT.DASHBOARD, icon: 'dashboard' },
    { name: 'Attendance', path: ROUTES.STUDENT.ATTENDANCE, icon: 'calendar' },
    { name: 'Analytics', path: ROUTES.STUDENT.ANALYTICS, icon: 'chart' }
  ]
};

export default {
  API_ROUTES,
  ROLES,
  ATTENDANCE_STATUS,
  SUBSCRIPTION_PLANS,
  CHART_COLORS,
  CHART_OPTIONS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  STORAGE_KEYS,
  THEMES,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  NAV_ITEMS
};