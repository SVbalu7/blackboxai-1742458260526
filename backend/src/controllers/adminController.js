const { AppError, asyncHandler } = require('../middleware/errorHandler');
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Dashboard Management
exports.updateCarousel = asyncHandler(async (req, res) => {
  const { carouselItems } = req.body;
  const admin = await Admin.findById(req.user._id);

  const updatedCarousel = await admin.updateCarousel(carouselItems);

  // Emit real-time update
  req.io.emit('carousel-updated', updatedCarousel);

  res.status(200).json({
    success: true,
    data: updatedCarousel
  });
});

exports.addUpdate = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const update = await admin.addUpdate(req.body);

  // Emit real-time update
  req.io.emit('updates-changed', {
    action: 'add',
    update
  });

  res.status(201).json({
    success: true,
    data: update
  });
});

exports.editUpdate = asyncHandler(async (req, res) => {
  const { updateId } = req.params;
  const admin = await Admin.findById(req.user._id);
  const update = await admin.editUpdate(updateId, req.body);

  // Emit real-time update
  req.io.emit('updates-changed', {
    action: 'edit',
    update
  });

  res.status(200).json({
    success: true,
    data: update
  });
});

exports.deleteUpdate = asyncHandler(async (req, res) => {
  const { updateId } = req.params;
  const admin = await Admin.findById(req.user._id);
  await admin.deleteUpdate(updateId);

  // Emit real-time update
  req.io.emit('updates-changed', {
    action: 'delete',
    updateId
  });

  res.status(200).json({
    success: true,
    message: 'Update deleted successfully'
  });
});

// Analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
  const { batchYear } = req.query;
  const admin = await Admin.findById(req.user._id);
  const analytics = await admin.getAnalytics(parseInt(batchYear));

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// Faculty Management
exports.getAllFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find()
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .populate('subjects.subject', 'name code');

  res.status(200).json({
    success: true,
    data: faculty
  });
});

exports.getFacultyById = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .populate('subjects.subject', 'name code');

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});

exports.assignSubjectToFaculty = asyncHandler(async (req, res) => {
  const { facultyId, subjectId, batchYears } = req.body;

  const faculty = await Faculty.findById(facultyId);
  const subject = await Subject.findById(subjectId);

  if (!faculty || !subject) {
    throw new AppError('Faculty or Subject not found', 404);
  }

  // Assign subject to faculty
  await subject.assignFaculty(facultyId, batchYears);

  // Emit real-time update
  req.io.emit('faculty-subject-assigned', {
    facultyId,
    subjectId,
    batchYears
  });

  res.status(200).json({
    success: true,
    message: 'Subject assigned successfully'
  });
});

// Student Management
exports.getAllStudents = asyncHandler(async (req, res) => {
  const { batchYear, search } = req.query;
  let query = {};

  if (batchYear) {
    query.batchYear = parseInt(batchYear);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const students = await Student.find(query)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .populate('subjects', 'name code');

  res.status(200).json({
    success: true,
    data: students
  });
});

exports.getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .select('-password -resetPasswordToken -resetPasswordExpire')
    .populate('subjects', 'name code')
    .populate('attendance.subject', 'name code')
    .populate('attendance.markedBy', 'name');

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

exports.addStudent = asyncHandler(async (req, res) => {
  const { batchYear } = req.body;

  // Auto-assign subjects based on batch year
  const batchSubjects = await Subject.find({ batchYears: batchYear });
  req.body.subjects = batchSubjects.map(subject => subject._id);

  const student = await Student.create(req.body);

  // Emit real-time update
  req.io.emit('student-added', {
    batchYear,
    student: {
      id: student._id,
      name: student.name,
      registrationNumber: student.registrationNumber
    }
  });

  res.status(201).json({
    success: true,
    data: student
  });
});

exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  // Emit real-time update
  req.io.emit('student-updated', {
    id: student._id,
    updates: req.body
  });

  res.status(200).json({
    success: true,
    data: student
  });
});

// Subject Management
exports.addSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);

  // Auto-assign subject to students of specified batch years
  const students = await Student.find({
    batchYear: { $in: req.body.batchYears }
  });

  const updatePromises = students.map(student => 
    Student.findByIdAndUpdate(
      student._id,
      { $push: { subjects: subject._id } }
    )
  );

  await Promise.all(updatePromises);

  // Emit real-time update
  req.io.emit('subject-added', {
    subject: {
      id: subject._id,
      name: subject.name,
      code: subject.code,
      batchYears: subject.batchYears
    }
  });

  res.status(201).json({
    success: true,
    data: subject
  });
});

exports.getSubjects = asyncHandler(async (req, res) => {
  const { batchYear } = req.query;
  let query = {};

  if (batchYear) {
    query.batchYears = parseInt(batchYear);
  }

  const subjects = await Subject.find(query)
    .populate('assignedFaculty.faculty', 'name email');

  res.status(200).json({
    success: true,
    data: subjects
  });
});

// Activity Logging
exports.logActivity = asyncHandler(async (req, res) => {
  const { action, details } = req.body;
  const admin = await Admin.findById(req.user._id);
  
  const activity = await admin.logActivity(action, details, req);

  res.status(200).json({
    success: true,
    data: activity
  });
});

// Get Activity Logs
exports.getActivityLogs = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  
  res.status(200).json({
    success: true,
    data: admin.activityLog
  });
});