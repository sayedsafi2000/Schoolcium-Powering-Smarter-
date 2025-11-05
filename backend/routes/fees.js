const express = require('express');
const Fee = require('../models/Fee');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all fees
router.get('/', auth, async (req, res) => {
  try {
    const { studentId, status, feeType } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    if (feeType) query.feeType = feeType;
    
    const fees = await Fee.find(query).populate('studentId');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student fees
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId }).populate('studentId');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create fee
router.post('/', auth, async (req, res) => {
  try {
    const fee = new Fee(req.body);
    await fee.save();
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Pay fee
router.post('/:id/pay', auth, async (req, res) => {
  try {
    const { paidAmount, paymentMethod, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    
    fee.paidAmount = (fee.paidAmount || 0) + paidAmount;
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    
    if (fee.paidAmount >= fee.amount) {
      fee.status = 'Paid';
    } else if (fee.paidAmount > 0) {
      fee.status = 'Partial';
    }
    
    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update fee
router.put('/:id', auth, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

