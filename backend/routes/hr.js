const express = require('express');
const Staff = require('../models/Staff');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all staff
router.get('/', auth, async (req, res) => {
  try {
    const staff = await Staff.find().populate('userId');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single staff
router.get('/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('userId');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create staff
router.post('/', auth, async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update staff
router.put('/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete staff
router.delete('/:id', auth, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

