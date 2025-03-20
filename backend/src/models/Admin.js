const mongoose = require('mongoose');
const User = require('./User');

const adminSchema = new mongoose.Schema({
  adminLevel: {
    type: String,
    enum: ['super', 'regular'],
    default: 'regular'
  },
  permissions: {
    manageUsers: {
      type: Boolean,
      default: true
    },
    manageContent: {
      type: Boolean,
      default: true
    },
    viewAnalytics: {
      type: Boolean,
      default: true
    },
    manageSettings: {
      type: Boolean,
      default: true
    }
  },
  dashboard: {
    carousel: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      imageUrl: {
        type: String
      },
      link: {
        type: String
      },
      order: {
        type: Number,
        default: 0
      },
      active: {
        type: Boolean,
        default: true
      }
    }],
    updates: [{
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      category: {
        type: String,
        enum: ['announcement', 'event', 'notice'],
        required: true
      },
      publishDate: {
        type: Date,
        default: Date.now
      },
      expiryDate: Date,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      }
    }]
  },
  activityLog: [{
    action: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String
  }]
}, {
  timestamps: true
});

// Method to manage carousel
adminSchema.methods.updateCarousel = async function(carouselData) {
  this.dashboard.carousel = carouselData;
  await this.save();
  return this.dashboard.carousel;
};

// Method to add updates
adminSchema.methods.addUpdate = async function(updateData) {
  this.dashboard.updates.push({
    ...updateData,
    createdBy: this._id
  });
  await this.save();
  return this.dashboard.updates[this.dashboard.updates.length - 1];
};

// Method to edit update
adminSchema.methods.editUpdate = async function(updateId, updateData) {
  const update = this.dashboard.updates.id(updateId);
  if (!update) {
    throw new Error('Update not found');
  }
  
  Object.assign(update, updateData);
  await this.save();
  return update;
};

// Method to delete update
adminSchema.methods.deleteUpdate = async function(updateId) {
  const updateIndex = this.dashboard.updates.findIndex(
    update => update._id.toString() === updateId
  );
  
  if (updateIndex === -1) {
    throw new Error('Update not found');
  }
  
  this.dashboard.updates.splice(updateIndex, 1);
  await this.save();
  return true;
};

// Method to log activity
adminSchema.methods.logActivity = async function(action, details, req) {
  this.activityLog.push({
    action,
    details,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent']
  });
  await this.save();
  return this.activityLog[this.activityLog.length - 1];
};

// Method to get analytics data
adminSchema.methods.getAnalytics = async function(batchYear) {
  const Student = mongoose.model('Student');
  const Faculty = mongoose.model('Faculty');
  
  const analytics = {
    totalStudents: await Student.countDocuments({ batchYear }),
    totalFaculty: await Faculty.countDocuments(),
    attendanceStats: {
      present: 0,
      absent: 0,
      leave: 0,
      total: 0
    }
  };

  // Get attendance statistics for the batch
  const students = await Student.find({ batchYear });
  students.forEach(student => {
    student.attendance.forEach(record => {
      analytics.attendanceStats.total++;
      if (record.status === 'P') analytics.attendanceStats.present++;
      else if (record.status === 'A') analytics.attendanceStats.absent++;
      else analytics.attendanceStats.leave++;
    });
  });

  // Calculate percentages
  if (analytics.attendanceStats.total > 0) {
    analytics.attendanceStats.presentPercentage = 
      (analytics.attendanceStats.present / analytics.attendanceStats.total) * 100;
    analytics.attendanceStats.absentPercentage = 
      (analytics.attendanceStats.absent / analytics.attendanceStats.total) * 100;
    analytics.attendanceStats.leavePercentage = 
      (analytics.attendanceStats.leave / analytics.attendanceStats.total) * 100;
  }

  return analytics;
};

// Static method to get all active updates
adminSchema.statics.getActiveUpdates = async function() {
  const admins = await this.find({
    'dashboard.updates.expiryDate': { $gt: new Date() }
  });
  
  const updates = admins.reduce((acc, admin) => {
    const activeUpdates = admin.dashboard.updates.filter(update => 
      !update.expiryDate || update.expiryDate > new Date()
    );
    return [...acc, ...activeUpdates];
  }, []);

  return updates.sort((a, b) => b.publishDate - a.publishDate);
};

const Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;