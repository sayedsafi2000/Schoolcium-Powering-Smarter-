const express = require('express');
const Exam = require('../models/Exam');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('class')
      .populate('subject')
      .populate('createdBy');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single exam
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('class')
      .populate('subject')
      .populate('createdBy');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam
router.post('/', auth, async (req, res) => {
  try {
    const exam = new Exam({
      ...req.body,
      createdBy: req.user.userId
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exam
router.put('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exam
router.delete('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

