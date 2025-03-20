const { AppError, asyncHandler } = require('../middleware/errorHandler');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Get faculty dashboard data
exports.getDashboard = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.user._id)
    .populate('subjects.subject', 'name code')
    .select('-password -resetPasswordToken -resetPasswordExpire');

  // Get admin's carousel and updates
  const Admin = require('../models/Admin');
  const admin = await Admin.findOne({ role: 'admin' });
  
  const dashboard = {
    faculty: faculty,
    carousel: admin?.dashboard?.carousel || [],
    updates: admin?.dashboard?.updates || []
  };

  res.status(200).json({
    success: true,
    data: dashboard
  });
});

// Get assigned subjects
exports.getAssignedSubjects = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.user._id)
    .populate('subjects.subject', 'name code description credits');

  res.status(200).json({
    success: true,
    data: faculty.subjects
  });
});

// Get students by subject and batch
exports.getStudentsBySubject = asyncHandler(async (req, res) => {
  const { subjectId, batchYear } = req.query;

  // Verify faculty is assigned to this subject and batch
  const faculty = await Faculty.findById(req.user._id);
  const canAccess = faculty.canMarkAttendance(subjectId, parseInt(batchYear));

  if (!canAccess) {
    throw new AppError('Not authorized to access this subject/batch', 403);
  }

  const students = await Student.find({
    batchYear: parseInt(batchYear),
    subjects: subjectId
  }).select('name registrationNumber profileImage');

  res.status(200).json({
    success: true,
    data: students
  });
});

// Mark attendance
exports.markAttendance = asyncHandler(async (req, res) => {
  const { subjectId, batchYear, date, attendanceData } = req.body;

  // Validate date
  const attendanceDate = new Date(date);
  if (isNaN(attendanceDate.getTime())) {
    throw new AppError('Invalid date format', 400);
  }

  // Check if date is not in future
  if (attendanceDate > new Date()) {
    throw new AppError('Cannot mark attendance for future dates', 400);
  }

  const faculty = await Faculty.findById(req.user._id);

  // Verify faculty can mark attendance for this subject and batch
  if (!faculty.canMarkAttendance(subjectId, parseInt(batchYear))) {
    throw new AppError('Not authorized to mark attendance for this subject/batch', 403);
  }

  // Check if attendance already marked for this date
  const existingAttendance = faculty.attendanceMarked.find(record => 
    record.subject.toString() === subjectId &&
    record.batchYear === parseInt(batchYear) &&
    new Date(record.date).toDateString() === attendanceDate.toDateString()
  );

  if (existingAttendance) {
    throw new AppError('Attendance already marked for this date', 400);
  }

  // Mark attendance
  const attendanceRecord = await faculty.markAttendance(
    subjectId,
    parseInt(batchYear),
    attendanceData,
    attendanceDate
  );

  // Update subject attendance statistics
  const subject = await Subject.findById(subjectId);
  await subject.updateAttendanceStats(parseInt(batchYear));

  // Emit real-time update
  req.io.emit('attendance-marked', {
    facultyId: faculty._id,
    subjectId,
    batchYear,
    date: attendanceDate,
    attendanceRecord
  });

  res.status(200).json({
    success: true,
    data: attendanceRecord
  });
});

// Edit attendance
exports.editAttendance = asyncHandler(async (req, res) => {
  const { attendanceId, studentId, newStatus } = req.body;

  // Validate status
  if (!['P', 'A', 'L'].includes(newStatus)) {
    throw new AppError('Invalid attendance status', 400);
  }

  const faculty = await Faculty.findById(req.user._id);
  const updatedRecord = await faculty.editAttendance(attendanceId, studentId, newStatus);

  // Get attendance record details for subject stats update
  const attendanceRecord = faculty.attendanceMarked.id(attendanceId);
  
  // Update subject attendance statistics
  const subject = await Subject.findById(attendanceRecord.subject);
  await subject.updateAttendanceStats(attendanceRecord.batchYear);

  // Emit real-time update
  req.io.emit('attendance-updated', {
    facultyId: faculty._id,
    attendanceId,
    studentId,
    newStatus,
    updatedRecord
  });

  res.status(200).json({
    success: true,
    data: updatedRecord
  });
});

// Get attendance records
exports.getAttendanceRecords = asyncHandler(async (req, res) => {
  const { subjectId, batchYear, month, year } = req.query;

  // Validate faculty access
  const faculty = await Faculty.findById(req.user._id);
  if (!faculty.canMarkAttendance(subjectId, parseInt(batchYear))) {
    throw new AppError('Not authorized to view attendance for this subject/batch', 403);
  }

  // Filter attendance records
  let query = {
    subject: subjectId,
    batchYear: parseInt(batchYear)
  };

  if (month && year) {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    query.date = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const records = await faculty.attendanceMarked
    .filter(record => 
      record.subject.toString() === subjectId &&
      record.batchYear === parseInt(batchYear) &&
      (!month || !year || (
        record.date >= query.date.$gte &&
        record.date <= query.date.$lte
      ))
    )
    .sort((a, b) => b.date - a.date);

  res.status(200).json({
    success: true,
    data: records
  });
});

// Get attendance statistics
exports.getAttendanceStats = asyncHandler(async (req, res) => {
  const { subjectId, batchYear } = req.query;

  // Validate faculty access
  const faculty = await Faculty.findById(req.user._id);
  if (!faculty.canMarkAttendance(subjectId, parseInt(batchYear))) {
    throw new AppError('Not authorized to view statistics for this subject/batch', 403);
  }

  // Get subject statistics
  const subject = await Subject.findById(subjectId);
  const stats = subject.attendanceStats.find(
    stat => stat.batchYear === parseInt(batchYear)
  );

  if (!stats) {
    throw new AppError('No statistics found for this subject/batch', 404);
  }

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['name', 'profileImage', 'qualifications', 'expertise'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const faculty = await Faculty.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).select('-password -resetPasswordToken -resetPasswordExpire');

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// Get device login status
exports.getDeviceStatus = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.user._id)
    .select('deviceLogins');

  res.status(200).json({
    success: true,
    data: faculty.deviceLogins
  });
});

// Handle device logout
exports.handleDeviceLogout = asyncHandler(async (req, res) => {
  const { deviceType } = req.body;

  if (!['desktop', 'mobile'].includes(deviceType)) {
    throw new AppError('Invalid device type', 400);
  }

  const faculty = await Faculty.findById(req.user._id);
  
  faculty.deviceLogins[deviceType] = {
    isLoggedIn: false,
    deviceId: null,
    lastLogin: null
  };

  await faculty.save();

  res.status(200).json({
    success: true,
    message: `Logged out from ${deviceType}`
  });
});