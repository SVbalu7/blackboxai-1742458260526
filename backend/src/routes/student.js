const express = require('express');
const router = express.Router();
const { auth, roleAuth, checkSubscription } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getAnalytics,
  getAttendance,
  getSubscriptionStatus,
  updateSubscription,
  updateProfile,
  getDeviceStatus,
  handleDeviceLogout
} = require('../controllers/studentController');

// Protect all routes
router.use(auth);
router.use(roleAuth(['student']));

// Dashboard Routes
router.get('/dashboard', getDashboard);

// Analytics Routes
router.get('/analytics', getAnalytics);

// Attendance Routes
router.get('/attendance', checkSubscription, getAttendance);

// Subscription Routes
router.get('/subscription', getSubscriptionStatus);
router.put('/subscription', updateSubscription);

// Profile Routes
router.put('/profile', updateProfile);

// Device Management Routes
router.get('/device-status', getDeviceStatus);
router.post('/device-logout', handleDeviceLogout);

// Validation Middleware
const validateAnalyticsQuery = (req, res, next) => {
  const { month, year } = req.query;
  const errors = [];

  if (month) {
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      errors.push('Invalid month value');
    }
  }

  if (year) {
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < currentYear - 4 || yearNum > currentYear) {
      errors.push('Invalid year value');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateAttendanceQuery = (req, res, next) => {
  const { subjectId, month, year, viewClassmates } = req.query;
  const errors = [];

  if (month) {
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      errors.push('Invalid month value');
    }
  }

  if (year) {
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < currentYear - 4 || yearNum > currentYear) {
      errors.push('Invalid year value');
    }
  }

  if (viewClassmates && !['true', 'false'].includes(viewClassmates)) {
    errors.push('viewClassmates must be true or false');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateSubscriptionUpdate = (req, res, next) => {
  const { plan, startDate, endDate } = req.body;
  const errors = [];

  if (!plan || !['basic', 'premium'].includes(plan)) {
    errors.push('Valid subscription plan (basic or premium) is required');
  }

  if (startDate && isNaN(new Date(startDate).getTime())) {
    errors.push('Invalid start date format');
  }

  if (endDate && isNaN(new Date(endDate).getTime())) {
    errors.push('Invalid end date format');
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    errors.push('End date must be after start date');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const allowedFields = ['name', 'profileImage'];
  const updates = Object.keys(req.body);
  const errors = [];

  // Check for invalid fields
  updates.forEach(update => {
    if (!allowedFields.includes(update)) {
      errors.push(`Invalid field: ${update}`);
    }
  });

  // Validate name if provided
  if (req.body.name && (typeof req.body.name !== 'string' || req.body.name.length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateDeviceLogout = (req, res, next) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      error: 'Device ID is required'
    });
  }

  next();
};

// Rate limiting for analytics and attendance queries
const rateLimit = require('express-rate-limit');

const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each student to 100 requests per 15 minutes
  message: 'Too many requests, please try again after 15 minutes'
});

// Apply validation middleware to routes
router.get('/analytics', queryLimiter, validateAnalyticsQuery, getAnalytics);
router.get('/attendance', queryLimiter, validateAttendanceQuery, checkSubscription, getAttendance);
router.put('/subscription', validateSubscriptionUpdate, updateSubscription);
router.put('/profile', validateProfileUpdate, updateProfile);
router.post('/device-logout', validateDeviceLogout, handleDeviceLogout);

module.exports = router;