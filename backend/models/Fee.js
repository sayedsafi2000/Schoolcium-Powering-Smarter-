const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { 
    type: String, 
    enum: ['Tuition', 'Library', 'Hostel', 'Transport', 'Exam', 'Other'],
    required: true 
  },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  paidDate: Date,
  status: { 
    type: String, 
    enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'Online', 'Cheque']
  },
  transactionId: String,
  receiptNumber: String,
  remarks: String,
  academicYear: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);

