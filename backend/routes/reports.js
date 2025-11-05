const express = require('express');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const { Transaction } = require('../models/Account');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Attendance report
router.get('/attendance', auth, async (req, res) => {
  try {
    const { startDate, endDate, classId } = req.query;
    const query = { type: 'student' };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (classId) query.class = classId;
    
    const attendance = await Attendance.find(query)
      .populate('studentId')
      .populate('class');
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Finance report
router.get('/finance', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const transactions = await Transaction.find(query).populate('accountId');
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      income,
      expense,
      balance: income - expense,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student progress report
router.get('/student/:studentId/progress', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const results = await Result.find({ studentId: req.params.studentId })
      .populate('examId')
      .populate('subject');
    
    const attendance = await Attendance.find({
      studentId: req.params.studentId,
      type: 'student'
    });
    
    const fees = await Fee.find({ studentId: req.params.studentId });
    
    res.json({
      student,
      results,
      attendance: {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'Present').length,
        absent: attendance.filter(a => a.status === 'Absent').length
      },
      fees: {
        total: fees.reduce((sum, f) => sum + f.amount, 0),
        paid: fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0),
        pending: fees.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const Teacher = require('../models/Teacher');
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    const totalTeachers = await Teacher.countDocuments({ status: 'Active' });
    const todayAttendance = await Attendance.countDocuments({
      date: new Date().toISOString().split('T')[0],
      status: 'Present'
    });
    
    const todayFees = await Fee.find({
      paidDate: new Date().toISOString().split('T')[0],
      status: 'Paid'
    });
    const todayRevenue = todayFees.reduce((sum, f) => sum + f.paidAmount, 0);
    
    res.json({
      totalStudents,
      totalTeachers,
      todayAttendance,
      todayRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

