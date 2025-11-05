const express = require('express');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Routine = require('../models/Routine');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Classes
router.get('/classes', auth, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('classTeacher')
      .populate('subjects.subject')
      .populate('subjects.teacher');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/classes', auth, async (req, res) => {
  try {
    const classData = new Class(req.body);
    await classData.save();
    res.status(201).json(classData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/classes/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Subjects
router.get('/subjects', auth, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/subjects', auth, async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Routines
router.get('/routines', auth, async (req, res) => {
  try {
    const { classId } = req.query;
    const query = classId ? { class: classId } : {};
    const routines = await Routine.find(query)
      .populate('class')
      .populate('subject')
      .populate('teacher');
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/routines', auth, async (req, res) => {
  try {
    const routine = new Routine(req.body);
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

