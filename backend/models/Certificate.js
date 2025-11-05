const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateType: { 
    type: String, 
    enum: ['Transfer', 'Character', 'Bonafide', 'Migration', 'Diploma', 'Degree'],
    required: true 
  },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Issued'],
    default: 'Pending'
  },
  issuedDate: Date,
  certificateNumber: String,
  remarks: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);

