const { AppError, asyncHandler } = require('../middleware/errorHandler');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Get student dashboard data
exports.getDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id)
    .populate('subjects', 'name code')
    .select('-password -resetPasswordToken -resetPasswordExpire');

  // Get admin's carousel and updates
  const Admin = require('../models/Admin');
  const admin = await Admin.findOne({ role: 'admin' });
  
  const dashboard = {
    student: student,
    carousel: admin?.dashboard?.carousel || [],
    updates: admin?.dashboard?.updates || []
  };

  res.status(200).json({
    success: true,
    data: dashboard
  });
});

// Get student analytics
exports.getAnalytics = asyncHandler(async (req, res) => {
  const { subjectId, month, year } = req.query;
  const student = await Student.findById(req.user._id)
    .populate('subjects', 'name code');

  let analytics = {
    overall: student.analytics.overallAttendance,
    subjects: []
  };

  // If specific subject requested
  if (subjectId) {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    // Filter attendance by month and year if provided
    let attendanceQuery = student.attendance.filter(record => 
      record.subject.toString() === subjectId
    );

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      
      attendanceQuery = attendanceQuery.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }

    const subjectStats = {
      subject: {
        id: subject._id,
        name: subject.name,
        code: subject.code
      },
      total: attendanceQuery.length,
      present: attendanceQuery.filter(record => record.status === 'P').length,
      absent: attendanceQuery.filter(record => record.status === 'A').length,
      leave: attendanceQuery.filter(record => record.status === 'L').length
    };

    subjectStats.percentage = subjectStats.total > 0 
      ? (subjectStats.present / subjectStats.total) * 100 
      : 0;

    analytics.subjects.push(subjectStats);
  } else {
    // Get analytics for all subjects
    for (const subject of student.subjects) {
      const attendanceQuery = student.attendance.filter(record => 
        record.subject.toString() === subject._id.toString()
      );

      const subjectStats = {
        subject: {
          id: subject._id,
          name: subject.name,
          code: subject.code
        },
        total: attendanceQuery.length,
        present: attendanceQuery.filter(record => record.status === 'P').length,
        absent: attendanceQuery.filter(record => record.status === 'A').length,
        leave: attendanceQuery.filter(record => record.status === 'L').length
      };

      subjectStats.percentage = subjectStats.total > 0 
        ? (subjectStats.present / subjectStats.total) * 100 
        : 0;

      analytics.subjects.push(subjectStats);
    }
  }

  res.status(200).json({
    success: true,
    data: analytics
  });
});

// Get attendance records
exports.getAttendance = asyncHandler(async (req, res) => {
  const { subjectId, month, year, viewClassmates } = req.query;
  
  // Check subscription for viewing classmates' attendance
  if (viewClassmates === 'true' && !req.user.subscription?.isActive) {
    throw new AppError('Subscription required to view classmates\' attendance', 403);
  }

  let query = {};
  
  // Filter by subject if provided
  if (subjectId) {
    query['subjects'] = subjectId;
  }

  // Filter by student's batch year
  query['batchYear'] = req.user.batchYear;

  // If not viewing classmates, only show own attendance
  if (viewClassmates !== 'true') {
    query['_id'] = req.user._id;
  }

  const students = await Student.find(query)
    .populate('subjects', 'name code')
    .populate('attendance.subject', 'name code')
    .populate('attendance.markedBy', 'name')
    .select('-password -resetPasswordToken -resetPasswordExpire');

  let attendance = [];

  for (const student of students) {
    let attendanceRecords = student.attendance;

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      
      attendanceRecords = attendanceRecords.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }

    // Filter by subject if provided
    if (subjectId) {
      attendanceRecords = attendanceRecords.filter(record => 
        record.subject._id.toString() === subjectId
      );
    }

    attendance.push({
      student: {
        id: student._id,
        name: student.name,
        registrationNumber: student.registrationNumber
      },
      records: attendanceRecords
    });
  }

  res.status(200).json({
    success: true,
    data: attendance
  });
});

// Get subscription status
exports.getSubscriptionStatus = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id)
    .select('subscription');

  res.status(200).json({
    success: true,
    data: student.subscription
  });
});

// Update subscription
exports.updateSubscription = asyncHandler(async (req, res) => {
  const { plan, startDate, endDate } = req.body;

  if (!['basic', 'premium'].includes(plan)) {
    throw new AppError('Invalid subscription plan', 400);
  }

  const student = await Student.findById(req.user._id);

  student.subscription = {
    isActive: true,
    plan,
    startDate: startDate || new Date(),
    endDate
  };

  await student.save();

  res.status(200).json({
    success: true,
    data: student.subscription
  });
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['name', 'profileImage'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const student = await Student.findByIdAndUpdate(
    req.user._id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).select('-password -resetPasswordToken -resetPasswordExpire');

  res.status(200).json({
    success: true,
    data: student
  });
});

// Get device login status
exports.getDeviceStatus = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user._id)
    .select('activeDevices subscription');

  res.status(200).json({
    success: true,
    data: {
      activeDevices: student.activeDevices,
      subscription: student.subscription,
      maxDevices: student.subscription?.isActive ? 'unlimited' : 1
    }
  });
});

// Handle device logout
exports.handleDeviceLogout = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;

  const student = await Student.findById(req.user._id);
  
  student.activeDevices = student.activeDevices.filter(
    device => device !== deviceId
  );

  await student.save();

  res.status(200).json({
    success: true,
    message: 'Device logged out successfully'
  });
});