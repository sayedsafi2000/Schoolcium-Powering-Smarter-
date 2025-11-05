const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
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
    designation: { type: String, required: true },
    department: String,
    qualification: String,
    experience: Number
  },
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

module.exports = mongoose.model('Staff', staffSchema);

