const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  type: { type: String, enum: ['image', 'pdf', 'file'], default: 'file' },
  size: { type: Number },
});

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Sports', 'Cultural', 'Other'],
      default: 'General',
    },
    noticeDate: { type: Date, default: Date.now },
    isPublished: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    featuredImage: {
      url: { type: String },
      cloudinaryId: { type: String },
    },
    attachments: [attachmentSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
noticeSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Notice', noticeSchema);
