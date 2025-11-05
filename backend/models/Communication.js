const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['General', 'Academic', 'Event', 'Urgent'],
    default: 'General'
  },
  targetAudience: [{
    type: String,
    enum: ['All', 'Students', 'Teachers', 'Parents', 'Staff']
  }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  publishDate: { type: Date, default: Date.now },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachments: [String],
  createdAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Announcement: mongoose.model('Announcement', announcementSchema),
  Message: mongoose.model('Message', messageSchema)
};

