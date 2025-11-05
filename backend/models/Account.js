const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountType: { 
    type: String, 
    enum: ['Income', 'Expense', 'Asset', 'Liability'],
    required: true 
  },
  balance: { type: Number, default: 0 },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { 
    type: String, 
    enum: ['Income', 'Expense'],
    required: true 
  },
  category: String,
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online']
  },
  reference: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Account: mongoose.model('Account', accountSchema),
  Transaction: mongoose.model('Transaction', transactionSchema)
};

