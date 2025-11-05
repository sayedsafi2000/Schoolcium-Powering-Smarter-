const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone: String,
    email: String,
    address: String,
    photo: String
  },
  professionalInfo: {
    employeeId: { type: String, unique: true },
    joiningDate: Date,
    qualification: String,
    specialization: String,
    experience: Number,
    department: String,
    designation: String
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  salary: {
    amount: Number,
    accountNumber: String,
    bankName: String
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'On Leave', 'Resigned'],
    default: 'Active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Teacher', teacherSchema);

