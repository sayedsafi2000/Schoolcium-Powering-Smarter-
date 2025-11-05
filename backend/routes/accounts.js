const express = require('express');
const { Account, Transaction } = require('../models/Account');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Accounts
router.get('/accounts', auth, async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/accounts', auth, async (req, res) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { accountId, type, startDate, endDate } = req.query;
    const query = {};
    if (accountId) query.accountId = accountId;
    if (type) query.type = type;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const transactions = await Transaction.find(query)
      .populate('accountId')
      .populate('createdBy')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/transactions', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      createdBy: req.user.userId
    });
    
    // Update account balance
    const account = await Account.findById(req.body.accountId);
    if (transaction.type === 'Income') {
      account.balance += transaction.amount;
    } else {
      account.balance -= transaction.amount;
    }
    await account.save();
    await transaction.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

