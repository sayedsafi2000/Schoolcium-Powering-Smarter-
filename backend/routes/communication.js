const express = require('express');
const { Announcement, Message } = require('../models/Communication');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Announcements
router.get('/announcements', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy')
      .populate('classes')
      .sort({ publishDate: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/announcements', auth, async (req, res) => {
  try {
    const announcement = new Announcement({
      ...req.body,
      createdBy: req.user.userId
    });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Messages
router.get('/messages', auth, async (req, res) => {
  try {
    const { type } = req.query;
    const query = type === 'sent' 
      ? { from: req.user.userId }
      : { to: req.user.userId };
    
    const messages = await Message.find(query)
      .populate('from', 'username email')
      .populate('to', 'username email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/messages', auth, async (req, res) => {
  try {
    const message = new Message({
      ...req.body,
      from: req.user.userId
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/messages/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

