const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Academic year settings
router.get('/academic-year', auth, async (req, res) => {
  try {
    res.json({ currentYear: '2024-2025' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// General settings
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    res.json({
      schoolName: 'Schoolcium',
      schoolCode: 'SCH001',
      address: '',
      phone: '',
      email: '',
      academicYear: '2024-2025',
      sessionStart: '',
      currency: 'BDT',
      timezone: 'Asia/Dhaka',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, authorize('admin'), async (req, res) => {
  try {
    res.json({ ...req.body, message: 'Settings saved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

