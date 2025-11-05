const express = require('express');
const Admission = require('../models/Admission');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all admissions
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const admissions = await Admission.find(query)
      .populate('applyingClass')
      .populate('reviewedBy');
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for admission
router.post('/', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update admission status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        reviewedBy: req.user.userId
      },
      { new: true }
    );
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    res.json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single admission
router.get('/:id', auth, async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .populate('applyingClass')
      .populate('reviewedBy');
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

