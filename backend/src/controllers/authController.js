const jwt = require('jsonwebtoken');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to get user model based on role
const getUserModel = (role) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return Admin;
    case 'faculty':
      return Faculty;
    case 'student':
      return Student;
    default:
      throw new AppError('Invalid role specified', 400);
  }
};

// Register user
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...additionalData } = req.body;

  // Validate role
  if (!['admin', 'faculty', 'student'].includes(role.toLowerCase())) {
    throw new AppError('Invalid role specified', 400);
  }

  // Check if user already exists
  const UserModel = getUserModel(role);
  const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Create user based on role
  const userData = {
    name,
    email: email.toLowerCase(),
    password,
    role,
    ...additionalData
  };

  const user = await UserModel.create(userData);

  // Generate token
  const token = generateToken(user._id, role);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(role === 'student' && { registrationNumber: user.registrationNumber }),
      ...(role === 'faculty' && { employeeId: user.employeeId })
    }
  });
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Validate input
  if (!email || !password || !role) {
    throw new AppError('Please provide email, password and role', 400);
  }

  // Get appropriate user model
  const UserModel = getUserModel(role);

  // Find user and include password for comparison
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check device login limitations for students and faculty
  if (role !== 'admin') {
    const currentDevice = req.headers['user-agent'];
    
    if (role === 'faculty' && user.activeDevices.length >= 2 && !user.activeDevices.includes(currentDevice)) {
      throw new AppError('Maximum device limit reached for faculty account', 403);
    }

    if (role === 'student' && !user.subscription?.isActive && 
        user.activeDevices.length >= 1 && !user.activeDevices.includes(currentDevice)) {
      throw new AppError('Maximum device limit reached. Please subscribe for multiple device access.', 403);
    }

    // Update active devices
    if (!user.activeDevices.includes(currentDevice)) {
      user.activeDevices.push(currentDevice);
      await user.save();
    }
  }

  // Generate token
  const token = generateToken(user._id, role);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(role === 'student' && {
        registrationNumber: user.registrationNumber,
        batchYear: user.batchYear,
        subscription: user.subscription
      }),
      ...(role === 'faculty' && {
        employeeId: user.employeeId,
        designation: user.designation
      }),
      ...(role === 'admin' && {
        adminLevel: user.adminLevel,
        permissions: user.permissions
      })
    }
  });
});

// Logout user
exports.logout = asyncHandler(async (req, res) => {
  const { role } = req.user;
  
  if (role !== 'admin') {
    const currentDevice = req.headers['user-agent'];
    
    // Remove current device from active devices
    req.user.activeDevices = req.user.activeDevices.filter(
      device => device !== currentDevice
    );
    
    await req.user.save();
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, role } = req.user;
  const UserModel = getUserModel(role);
  
  const user = await UserModel.findById(_id)
    .select('-password -resetPasswordToken -resetPasswordExpire');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    user
  });
});

// Request password reset
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  const UserModel = getUserModel(role);
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError('User not found with this email', 404);
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Send reset email (implement email sending logic here)
  // For now, just return the token
  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    resetToken // Remove this in production
  });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password, role } = req.body;

  const UserModel = getUserModel(role);
  const user = await UserModel.findOne({
    resetPasswordToken: crypto
      .createHash('sha256')
      .update(token)
      .digest('hex'),
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

// Update password
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});