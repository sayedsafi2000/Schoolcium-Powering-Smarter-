const express = require('express');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const { Announcement } = require('../models/Communication');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get student info (for parent)
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('academicInfo.class');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student attendance
router.get('/student/:studentId/attendance', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { studentId: req.params.studentId, type: 'student' };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const attendance = await Attendance.find(query);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student results
router.get('/student/:studentId/results', auth, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate('examId')
      .populate('subject');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student fees
router.get('/student/:studentId/fees', auth, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.params.studentId });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get announcements
router.get('/announcements', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { targetAudience: 'All' },
        { targetAudience: 'Parents' }
      ]
    }).populate('createdBy');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

