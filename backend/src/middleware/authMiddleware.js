const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check device login limitations
    if (user.role !== 'admin') {
      const currentDevice = req.headers['user-agent'];
      
      if (!user.activeDevices) {
        user.activeDevices = [currentDevice];
      }

      // Admin has unlimited devices
      if (user.role === 'faculty' && user.activeDevices.length >= 2 && !user.activeDevices.includes(currentDevice)) {
        return res.status(403).json({ message: 'Maximum device limit reached for faculty' });
      }

      if (user.role === 'student' && !user.subscription && user.activeDevices.length >= 1 && !user.activeDevices.includes(currentDevice)) {
        return res.status(403).json({ message: 'Maximum device limit reached. Please subscribe for multiple device access.' });
      }

      if (!user.activeDevices.includes(currentDevice)) {
        user.activeDevices.push(currentDevice);
        await user.save();
      }
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied: insufficient permissions' 
      });
    }
    next();
  };
};

// Middleware to check subscription for students
const checkSubscription = async (req, res, next) => {
  try {
    if (req.user.role === 'student' && !req.user.subscription && req.query.viewClassmates === 'true') {
      return res.status(403).json({ 
        message: 'Subscription required to view classmates\' attendance' 
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth, roleAuth, checkSubscription };