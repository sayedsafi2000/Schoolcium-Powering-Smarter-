const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  examType: { 
    type: String, 
    enum: ['Quiz', 'Midterm', 'Final', 'Assignment', 'Project'],
    required: true 
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: Number, // in minutes
  totalMarks: { type: Number, required: true },
  passingMarks: Number,
  instructions: String,
  status: { 
    type: String, 
    enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);

