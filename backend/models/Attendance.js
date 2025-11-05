const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['student', 'teacher', 'staff'],
    required: true 
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    required: true 
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  remarks: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);

