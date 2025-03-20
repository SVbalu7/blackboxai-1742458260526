const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(auth); // Apply auth middleware to all routes below
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/update-password', updatePassword);

// Health check route
router.get('/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth routes are working',
    timestamp: new Date().toISOString()
  });
});

// Validation middleware for registration
const validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!role || !['admin', 'faculty', 'student'].includes(role.toLowerCase())) {
    errors.push('Please provide a valid role (admin, faculty, or student)');
  }

  // Role-specific validations
  if (role === 'student' && !req.body.registrationNumber) {
    errors.push('Registration number is required for students');
  }

  if (role === 'faculty' && !req.body.employeeId) {
    errors.push('Employee ID is required for faculty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
  const { email, password, role } = req.body;
  const errors = [];

  if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (!role || !['admin', 'faculty', 'student'].includes(role.toLowerCase())) {
    errors.push('Please provide a valid role (admin, faculty, or student)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

// Apply validation middleware to routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Rate limiting for auth routes
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for failed attempts
  message: 'Too many login attempts, please try again after 15 minutes'
});

// Apply rate limiting to sensitive routes
router.post('/login', authLimiter, validateLogin, login);
router.post('/forgot-password', authLimiter, forgotPassword);

module.exports = router;