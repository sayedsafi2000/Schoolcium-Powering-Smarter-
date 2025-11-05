const express = require('express');
const Result = require('../models/Result');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all results
router.get('/', auth, async (req, res) => {
  try {
    const { studentId, examId, classId } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (examId) query.examId = examId;
    if (classId) query.class = classId;
    
    const results = await Result.find(query)
      .populate('studentId')
      .populate('examId')
      .populate('subject')
      .populate('class');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student results
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate('examId')
      .populate('subject')
      .populate('class');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enter result
router.post('/', auth, async (req, res) => {
  try {
    const result = new Result({
      ...req.body,
      enteredBy: req.user.userId
    });
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk enter results
router.post('/bulk', auth, async (req, res) => {
  try {
    const { results } = req.body;
    const resultsData = results.map(r => ({
      ...r,
      enteredBy: req.user.userId
    }));
    const savedResults = await Result.insertMany(resultsData);
    res.status(201).json(savedResults);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update result
router.put('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

