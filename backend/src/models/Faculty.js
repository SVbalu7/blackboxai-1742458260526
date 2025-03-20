const mongoose = require('mongoose');
const User = require('./User');

const facultySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    batchYears: [{
      type: Number,
      required: true
    }]
  }],
  expertise: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  attendanceMarked: [{
    date: {
      type: Date,
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    batchYear: {
      type: Number,
      required: true
    },
    studentsMarked: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
      status: {
        type: String,
        enum: ['P', 'A', 'L'],
        required: true
      }
    }]
  }],
  deviceLogins: {
    desktop: {
      isLoggedIn: {
        type: Boolean,
        default: false
      },
      deviceId: String,
      lastLogin: Date
    },
    mobile: {
      isLoggedIn: {
        type: Boolean,
        default: false
      },
      deviceId: String,
      lastLogin: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total attendance records marked
facultySchema.virtual('totalAttendanceMarked').get(function() {
  return this.attendanceMarked.reduce((total, record) => 
    total + record.studentsMarked.length, 0);
});

// Method to check if faculty can mark attendance for a subject and batch
facultySchema.methods.canMarkAttendance = function(subjectId, batchYear) {
  return this.subjects.some(subject => 
    subject.subject.toString() === subjectId.toString() && 
    subject.batchYears.includes(batchYear)
  );
};

// Method to mark attendance for multiple students
facultySchema.methods.markAttendance = async function(subjectId, batchYear, studentsAttendance, date) {
  if (!this.canMarkAttendance(subjectId, batchYear)) {
    throw new Error('Not authorized to mark attendance for this subject and batch');
  }

  const attendanceRecord = {
    date: date || new Date(),
    subject: subjectId,
    batchYear,
    studentsMarked: studentsAttendance
  };

  this.attendanceMarked.push(attendanceRecord);
  await this.save();

  // Update student attendance records
  const Student = mongoose.model('Student');
  const updatePromises = studentsAttendance.map(({ student, status }) => 
    Student.findByIdAndUpdate(student, {
      $push: {
        attendance: {
          subject: subjectId,
          date: date || new Date(),
          status,
          markedBy: this._id
        }
      }
    })
  );

  await Promise.all(updatePromises);
  return attendanceRecord;
};

// Method to edit past attendance
facultySchema.methods.editAttendance = async function(attendanceId, studentId, newStatus) {
  const attendanceRecord = this.attendanceMarked.id(attendanceId);
  if (!attendanceRecord) {
    throw new Error('Attendance record not found');
  }

  const studentRecord = attendanceRecord.studentsMarked.find(
    record => record.student.toString() === studentId
  );
  if (!studentRecord) {
    throw new Error('Student record not found');
  }

  studentRecord.status = newStatus;
  await this.save();

  // Update student's attendance record
  const Student = mongoose.model('Student');
  await Student.findOneAndUpdate(
    {
      _id: studentId,
      'attendance.subject': attendanceRecord.subject,
      'attendance.date': attendanceRecord.date
    },
    {
      $set: {
        'attendance.$.status': newStatus
      }
    }
  );

  return studentRecord;
};

// Method to handle device login
facultySchema.methods.handleDeviceLogin = async function(deviceType, deviceId) {
  if (!['desktop', 'mobile'].includes(deviceType)) {
    throw new Error('Invalid device type');
  }

  // Check if another device of same type is already logged in
  if (this.deviceLogins[deviceType].isLoggedIn && 
      this.deviceLogins[deviceType].deviceId !== deviceId) {
    throw new Error(`Another ${deviceType} device is already logged in`);
  }

  this.deviceLogins[deviceType] = {
    isLoggedIn: true,
    deviceId,
    lastLogin: new Date()
  };

  await this.save();
  return true;
};

const Faculty = User.discriminator('Faculty', facultySchema);

module.exports = Faculty;