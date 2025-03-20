const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  batchYear: {
    type: Number,
    required: [true, 'Batch year is required'],
    validate: {
      validator: function(v) {
        const currentYear = new Date().getFullYear();
        return v <= currentYear && v >= currentYear - 4;
      },
      message: props => `${props.value} is not a valid batch year!`
    }
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  attendance: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['P', 'A', 'L'],
      required: true
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    }
  }],
  subscription: {
    isActive: {
      type: Boolean,
      default: false
    },
    plan: {
      type: String,
      enum: ['basic', 'premium', null],
      default: null
    },
    startDate: Date,
    endDate: Date
  },
  analytics: {
    overallAttendance: {
      type: Number,
      default: 0
    },
    subjectWiseAttendance: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
      },
      percentage: Number,
      present: Number,
      absent: Number,
      leave: Number
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating age
studentSchema.virtual('attendancePercentage').get(function() {
  if (!this.attendance.length) return 0;
  
  const totalClasses = this.attendance.length;
  const presentClasses = this.attendance.filter(a => a.status === 'P').length;
  return (presentClasses / totalClasses) * 100;
});

// Middleware to auto-assign subjects based on batch year
studentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('batchYear')) {
    try {
      const Subject = mongoose.model('Subject');
      const batchSubjects = await Subject.find({ batchYear: this.batchYear });
      this.subjects = batchSubjects.map(subject => subject._id);
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Method to update analytics
studentSchema.methods.updateAnalytics = async function() {
  const totalAttendance = this.attendance.length;
  if (totalAttendance === 0) return;

  // Calculate overall attendance
  const presentCount = this.attendance.filter(a => a.status === 'P').length;
  this.analytics.overallAttendance = (presentCount / totalAttendance) * 100;

  // Calculate subject-wise attendance
  const subjectAttendance = {};
  this.attendance.forEach(record => {
    if (!subjectAttendance[record.subject]) {
      subjectAttendance[record.subject] = {
        present: 0,
        absent: 0,
        leave: 0,
        total: 0
      };
    }
    subjectAttendance[record.subject][record.status === 'P' ? 'present' : 
                                    record.status === 'A' ? 'absent' : 'leave']++;
    subjectAttendance[record.subject].total++;
  });

  this.analytics.subjectWiseAttendance = Object.entries(subjectAttendance).map(([subject, stats]) => ({
    subject,
    percentage: (stats.present / stats.total) * 100,
    present: stats.present,
    absent: stats.absent,
    leave: stats.leave
  }));

  await this.save();
};

// Method to check subscription status
studentSchema.methods.hasValidSubscription = function() {
  if (!this.subscription.isActive) return false;
  if (!this.subscription.endDate) return false;
  return new Date() <= new Date(this.subscription.endDate);
};

const Student = User.discriminator('Student', studentSchema);

module.exports = Student;