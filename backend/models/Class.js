const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: String,
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  subjects: [{ 
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
  }],
  capacity: { type: Number, default: 40 },
  currentStrength: { type: Number, default: 0 },
  academicYear: String,
  roomNumber: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);

