const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/authMiddleware');
const {
  updateCarousel,
  addUpdate,
  editUpdate,
  deleteUpdate,
  getAnalytics,
  getAllFaculty,
  getFacultyById,
  assignSubjectToFaculty,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  addSubject,
  getSubjects,
  logActivity,
  getActivityLogs
} = require('../controllers/adminController');

// Protect all routes
router.use(auth);
router.use(roleAuth(['admin']));

// Dashboard Management Routes
router.route('/dashboard/carousel')
  .put(updateCarousel);

router.route('/dashboard/updates')
  .post(addUpdate);

router.route('/dashboard/updates/:updateId')
  .put(editUpdate)
  .delete(deleteUpdate);

// Analytics Routes
router.route('/analytics')
  .get(getAnalytics);

// Faculty Management Routes
router.route('/faculty')
  .get(getAllFaculty);

router.route('/faculty/:id')
  .get(getFacultyById);

router.route('/faculty/assign-subject')
  .post(assignSubjectToFaculty);

// Student Management Routes
router.route('/students')
  .get(getAllStudents)
  .post(addStudent);

router.route('/students/:id')
  .get(getStudentById)
  .put(updateStudent);

// Subject Management Routes
router.route('/subjects')
  .get(getSubjects)
  .post(addSubject);

// Activity Logging Routes
router.route('/activity')
  .post(logActivity)
  .get(getActivityLogs);

// Validation Middleware
const validateCarouselUpdate = (req, res, next) => {
  const { carouselItems } = req.body;
  
  if (!Array.isArray(carouselItems)) {
    return res.status(400).json({
      success: false,
      message: 'carouselItems must be an array'
    });
  }

  const isValid = carouselItems.every(item => {
    return (
      item.title &&
      typeof item.title === 'string' &&
      (!item.description || typeof item.description === 'string') &&
      (!item.imageUrl || typeof item.imageUrl === 'string')
    );
  });

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid carousel item format'
    });
  }

  next();
};

const validateUpdate = (req, res, next) => {
  const { title, content, category, priority } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (!content || typeof content !== 'string') {
    errors.push('Content is required and must be a string');
  }

  if (!category || !['announcement', 'event', 'notice'].includes(category)) {
    errors.push('Valid category is required (announcement, event, or notice)');
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateStudent = (req, res, next) => {
  const { name, email, registrationNumber, batchYear } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.push('Valid email is required');
  }

  if (!registrationNumber || typeof registrationNumber !== 'string') {
    errors.push('Registration number is required');
  }

  if (!batchYear || !Number.isInteger(batchYear)) {
    errors.push('Valid batch year is required');
  }

  const currentYear = new Date().getFullYear();
  if (batchYear < currentYear - 4 || batchYear > currentYear) {
    errors.push('Batch year must be within the last 4 years');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateSubject = (req, res, next) => {
  const { code, name, credits, batchYears } = req.body;
  const errors = [];

  if (!code || typeof code !== 'string') {
    errors.push('Subject code is required');
  }

  if (!name || typeof name !== 'string') {
    errors.push('Subject name is required');
  }

  if (!credits || !Number.isInteger(credits) || credits < 1 || credits > 6) {
    errors.push('Credits must be an integer between 1 and 6');
  }

  if (!Array.isArray(batchYears) || batchYears.length === 0) {
    errors.push('At least one batch year must be specified');
  }

  const currentYear = new Date().getFullYear();
  const invalidBatchYears = batchYears.filter(
    year => year < currentYear - 4 || year > currentYear
  );

  if (invalidBatchYears.length > 0) {
    errors.push('All batch years must be within the last 4 years');
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
router.put('/dashboard/carousel', validateCarouselUpdate, updateCarousel);
router.post('/dashboard/updates', validateUpdate, addUpdate);
router.put('/dashboard/updates/:updateId', validateUpdate, editUpdate);
router.post('/students', validateStudent, addStudent);
router.put('/students/:id', validateStudent, updateStudent);
router.post('/subjects', validateSubject, addSubject);

module.exports = router;