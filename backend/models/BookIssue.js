const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  issueDate: { type: Date, required: true, default: Date.now },
  returnDate: Date,
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Issued', 'Returned', 'Overdue', 'Lost'],
    default: 'Issued'
  },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: String,
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookIssue', bookIssueSchema);

