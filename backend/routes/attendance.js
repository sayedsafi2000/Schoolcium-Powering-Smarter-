const express = require('express');
const Attendance = require('../models/Attendance');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all attendance
router.get('/', auth, async (req, res) => {
  try {
    const { date, type, classId } = req.query;
    const query = {};
    if (date) query.date = new Date(date);
    if (type) query.type = type;
    if (classId) query.class = classId;
    
    const attendance = await Attendance.find(query)
      .populate('studentId')
      .populate('teacherId')
      .populate('staffId')
      .populate('class');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance
router.post('/', auth, async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      markedBy: req.user.userId
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk mark attendance
router.post('/bulk', auth, async (req, res) => {
  try {
    const { date, type, records } = req.body;
    const attendanceRecords = records.map(record => ({
      ...record,
      date,
      type,
      markedBy: req.user.userId
    }));
    const attendance = await Attendance.insertMany(attendanceRecords);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance
router.put('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

