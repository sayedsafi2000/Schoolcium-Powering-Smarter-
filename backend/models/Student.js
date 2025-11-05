const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: String,
    phone: String,
    email: String,
    address: String,
    photo: String
  },
  guardianInfo: {
    fatherName: String,
    fatherPhone: String,
    motherName: String,
    motherPhone: String,
    guardianName: String,
    guardianPhone: String,
    guardianRelation: String,
    guardianEmail: String
  },
  academicInfo: {
    admissionDate: { type: Date, default: Date.now },
    admissionNumber: { type: String, unique: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    section: String,
    rollNumber: String,
    academicYear: String
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Graduated', 'Transferred'],
    default: 'Active'
  },
  transport: {
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute' },
    stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportStop' }
  },
  hostel: {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'HostelRoom' },
    bedNumber: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);

