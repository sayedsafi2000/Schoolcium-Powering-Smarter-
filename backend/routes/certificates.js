const express = require('express');
const Certificate = require('../models/Certificate');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all certificates
router.get('/', auth, async (req, res) => {
  try {
    const { studentId, status } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    
    const certificates = await Certificate.find(query)
      .populate('studentId')
      .populate('approvedBy');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply for certificate
router.post('/', auth, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve certificate
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: req.user.userId,
        ...req.body
      },
      { new: true }
    );
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Issue certificate
router.put('/:id/issue', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Issued',
        issuedDate: new Date(),
        certificateNumber: req.body.certificateNumber,
        fileUrl: req.body.fileUrl
      },
      { new: true }
    );
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

