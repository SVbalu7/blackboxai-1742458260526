const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getAssignedSubjects,
  getStudentsBySubject,
  markAttendance,
  editAttendance,
  getAttendanceRecords,
  getAttendanceStats,
  updateProfile,
  getDeviceStatus,
  handleDeviceLogout
} = require('../controllers/facultyController');

// Protect all routes
router.use(auth);
router.use(roleAuth(['faculty']));

// Dashboard Routes
router.get('/dashboard', getDashboard);

// Subject Routes
router.get('/subjects', getAssignedSubjects);
router.get('/students', getStudentsBySubject);

// Attendance Routes
router.route('/attendance')
  .post(markAttendance)
  .get(getAttendanceRecords);

router.route('/attendance/edit')
  .put(editAttendance);

router.get('/attendance/stats', getAttendanceStats);

// Profile Routes
router.route('/profile')
  .put(updateProfile);

// Device Management Routes
router.get('/device-status', getDeviceStatus);
router.post('/device-logout', handleDeviceLogout);

// Validation Middleware
const validateAttendanceMarking = (req, res, next) => {
  const { subjectId, batchYear, date, attendanceData } = req.body;
  const errors = [];

  if (!subjectId) {
    errors.push('Subject ID is required');
  }

  if (!batchYear || !Number.isInteger(parseInt(batchYear))) {
    errors.push('Valid batch year is required');
  }

  if (!date || isNaN(new Date(date).getTime())) {
    errors.push('Valid date is required');
  }

  if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
    errors.push('Attendance data must be a non-empty array');
  } else {
    attendanceData.forEach((record, index) => {
      if (!record.student || !record.status) {
        errors.push(`Invalid attendance record at index ${index}`);
      }
      if (!['P', 'A', 'L'].includes(record.status)) {
        errors.push(`Invalid attendance status at index ${index}`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateAttendanceEdit = (req, res, next) => {
  const { attendanceId, studentId, newStatus } = req.body;
  const errors = [];

  if (!attendanceId) {
    errors.push('Attendance record ID is required');
  }

  if (!studentId) {
    errors.push('Student ID is required');
  }

  if (!newStatus || !['P', 'A', 'L'].includes(newStatus)) {
    errors.push('Valid attendance status (P, A, or L) is required');
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
  const allowedFields = ['name', 'profileImage', 'qualifications', 'expertise'];
  const updates = Object.keys(req.body);
  const errors = [];

  // Check for invalid fields
  updates.forEach(update => {
    if (!allowedFields.includes(update)) {
      errors.push(`Invalid field: ${update}`);
    }
  });

  // Validate specific fields
  if (req.body.name && (typeof req.body.name !== 'string' || req.body.name.length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (req.body.qualifications && !Array.isArray(req.body.qualifications)) {
    errors.push('Qualifications must be an array');
  }

  if (req.body.expertise && !Array.isArray(req.body.expertise)) {
    errors.push('Expertise must be an array');
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
  const { deviceType } = req.body;

  if (!deviceType || !['desktop', 'mobile'].includes(deviceType)) {
    return res.status(400).json({
      success: false,
      error: 'Valid device type (desktop or mobile) is required'
    });
  }

  next();
};

// Rate limiting for attendance marking
const rateLimit = require('express-rate-limit');

const attendanceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each faculty to 100 attendance records per 15 minutes
  message: 'Too many attendance records created, please try again after 15 minutes'
});

// Apply validation middleware to routes
router.post('/attendance', attendanceLimiter, validateAttendanceMarking, markAttendance);
router.put('/attendance/edit', validateAttendanceEdit, editAttendance);
router.put('/profile', validateProfileUpdate, updateProfile);
router.post('/device-logout', validateDeviceLogout, handleDeviceLogout);

module.exports = router;