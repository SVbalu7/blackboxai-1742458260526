const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  batchYears: [{
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        const currentYear = new Date().getFullYear();
        return v <= currentYear && v >= currentYear - 4;
      },
      message: props => `${props.value} is not a valid batch year!`
    }
  }],
  assignedFaculty: [{
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    batchYear: {
      type: Number,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  schedule: [{
    batchYear: {
      type: Number,
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    }
  }],
  attendanceStats: [{
    batchYear: {
      type: Number,
      required: true
    },
    totalClasses: {
      type: Number,
      default: 0
    },
    averageAttendance: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  syllabus: [{
    unit: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    topics: [{
      type: String,
      required: true
    }],
    hours: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
subjectSchema.index({ code: 1, batchYears: 1 });

// Virtual for total assigned faculty
subjectSchema.virtual('totalAssignedFaculty').get(function() {
  return this.assignedFaculty.length;
});

// Method to assign faculty
subjectSchema.methods.assignFaculty = async function(facultyId, batchYear) {
  // Check if faculty is already assigned to this batch
  const existingAssignment = this.assignedFaculty.find(
    assignment => 
      assignment.faculty.toString() === facultyId.toString() && 
      assignment.batchYear === batchYear
  );

  if (existingAssignment) {
    throw new Error('Faculty is already assigned to this subject for this batch');
  }

  this.assignedFaculty.push({
    faculty: facultyId,
    batchYear
  });

  await this.save();

  // Update faculty's subjects
  const Faculty = mongoose.model('Faculty');
  await Faculty.findByIdAndUpdate(
    facultyId,
    {
      $addToSet: {
        'subjects': {
          subject: this._id,
          batchYears: [batchYear]
        }
      }
    }
  );

  return this;
};

// Method to remove faculty assignment
subjectSchema.methods.removeFaculty = async function(facultyId, batchYear) {
  const assignmentIndex = this.assignedFaculty.findIndex(
    assignment => 
      assignment.faculty.toString() === facultyId.toString() && 
      assignment.batchYear === batchYear
  );

  if (assignmentIndex === -1) {
    throw new Error('Faculty assignment not found');
  }

  this.assignedFaculty.splice(assignmentIndex, 1);
  await this.save();

  // Update faculty's subjects
  const Faculty = mongoose.model('Faculty');
  await Faculty.findByIdAndUpdate(
    facultyId,
    {
      $pull: {
        subjects: {
          subject: this._id,
          batchYears: batchYear
        }
      }
    }
  );

  return this;
};

// Method to update attendance statistics
subjectSchema.methods.updateAttendanceStats = async function(batchYear) {
  const Student = mongoose.model('Student');
  
  // Get all students from the batch
  const students = await Student.find({ batchYear });
  
  let totalPresent = 0;
  let totalClasses = 0;

  students.forEach(student => {
    const subjectAttendance = student.attendance.filter(
      record => record.subject.toString() === this._id.toString()
    );
    
    totalClasses = Math.max(totalClasses, subjectAttendance.length);
    totalPresent += subjectAttendance.filter(record => record.status === 'P').length;
  });

  const averageAttendance = students.length > 0 ? 
    (totalPresent / (totalClasses * students.length)) * 100 : 0;

  // Update or create stats for this batch
  const statsIndex = this.attendanceStats.findIndex(
    stats => stats.batchYear === batchYear
  );

  if (statsIndex >= 0) {
    this.attendanceStats[statsIndex] = {
      batchYear,
      totalClasses,
      averageAttendance,
      lastUpdated: new Date()
    };
  } else {
    this.attendanceStats.push({
      batchYear,
      totalClasses,
      averageAttendance,
      lastUpdated: new Date()
    });
  }

  await this.save();
  return this.attendanceStats.find(stats => stats.batchYear === batchYear);
};

// Static method to get subjects by batch year
subjectSchema.statics.getByBatchYear = function(batchYear) {
  return this.find({
    batchYears: batchYear,
    isActive: true
  }).populate('assignedFaculty.faculty', 'name email');
};

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;