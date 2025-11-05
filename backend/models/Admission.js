const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationNumber: { type: String, unique: true },
  applicantName: { type: String, required: true },
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  phone: String,
  email: String,
  address: String,
  applyingClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  previousSchool: String,
  guardianName: String,
  guardianPhone: String,
  guardianEmail: String,
  applicationDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Admitted'],
    default: 'Pending'
  },
  interviewDate: Date,
  testScore: Number,
  remarks: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);

