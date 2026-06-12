const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Notice = require('../models/Notice');
const { auth } = require('../middleware/auth');

// ─── Cloudinary Config ───────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'domn2k79e',
  api_key: process.env.CLOUDINARY_API_KEY || '382733537575279',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'X8Lqo_AbMGsrSefDBzQk46aDJ40',
  secure: true,
});

// ─── Multer Storages ─────────────────────────────────────────────────────────

// Image storage (jpg/png/webp)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'school-management/notices/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    resource_type: 'image',
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto:good' }],
    use_filename: true,
    unique_filename: true,
  },
});

// File/PDF storage (auto resource_type handles PDF + other files)
const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder: 'school-management/notices/files',
      resource_type: isPdf ? 'raw' : 'auto',
      use_filename: true,
      unique_filename: true,
    };
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx|xls|xlsx|ppt|pptx|zip|txt/.test(
      file.originalname.toLowerCase()
    );
    if (allowed || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

// ─── Error handler helper ─────────────────────────────────────────────────────
function handleError(err, req, res, next) {
  if (err) return res.status(400).json({ message: err.message });
  next();
}

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/notices/public  — published notices for the website
router.get('/public', async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .select('-createdBy')
      .sort({ isImportant: -1, noticeDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ notices, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/notices/public/:slug  — single published notice by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const notice = await Notice.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).select('-createdBy');

    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── ADMIN ROUTES (require auth) ──────────────────────────────────────────────

// GET /api/notices  — all notices (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { category, search, isPublished, isImportant } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isImportant !== undefined) query.isImportant = isImportant === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const notices = await Notice.find(query)
      .populate('createdBy', 'username')
      .sort({ isImportant: -1, noticeDate: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/notices/:id  — single notice (admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'username');
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notices  — create notice
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const {
      title, slug, shortDescription, content, category,
      noticeDate, isPublished, isImportant,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const notice = new Notice({
      title,
      slug: slug || undefined, // let pre-validate hook auto-generate
      shortDescription,
      content,
      category: category || 'General',
      noticeDate: noticeDate ? new Date(noticeDate) : new Date(),
      isPublished: isPublished === 'true' || isPublished === true,
      isImportant: isImportant === 'true' || isImportant === true,
      createdBy: req.user.id,
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A notice with this slug already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/notices/:id  — update notice
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const {
      title, slug, shortDescription, content, category,
      noticeDate, isPublished, isImportant,
    } = req.body;

    if (title) notice.title = title;
    if (slug) notice.slug = slug;
    if (shortDescription !== undefined) notice.shortDescription = shortDescription;
    if (content) notice.content = content;
    if (category) notice.category = category;
    if (noticeDate) notice.noticeDate = new Date(noticeDate);
    if (isPublished !== undefined) notice.isPublished = isPublished === 'true' || isPublished === true;
    if (isImportant !== undefined) notice.isImportant = isImportant === 'true' || isImportant === true;

    await notice.save();
    res.json(notice);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A notice with this slug already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/notices/:id/publish  — toggle publish
router.patch('/:id/publish', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    notice.isPublished = !notice.isPublished;
    await notice.save();
    res.json({ isPublished: notice.isPublished, message: notice.isPublished ? 'Notice published' : 'Notice unpublished' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/notices/:id/important  — toggle important/pinned
router.patch('/:id/important', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    notice.isImportant = !notice.isImportant;
    await notice.save();
    res.json({ isImportant: notice.isImportant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notices/:id/image  — upload featured image
router.post('/:id/image', auth, (req, res, next) => {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}, uploadImage.single('image'), handleError, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Delete old image if exists
    if (notice.featuredImage?.cloudinaryId) {
      try { await cloudinary.uploader.destroy(notice.featuredImage.cloudinaryId); } catch {}
    }

    notice.featuredImage = {
      url: req.file.path || req.file.secure_url,
      cloudinaryId: req.file.filename || req.file.public_id,
    };
    await notice.save();
    res.json({ featuredImage: notice.featuredImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notices/:id/image  — remove featured image
router.delete('/:id/image', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (notice.featuredImage?.cloudinaryId) {
      try { await cloudinary.uploader.destroy(notice.featuredImage.cloudinaryId); } catch {}
    }
    notice.featuredImage = undefined;
    await notice.save();
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/notices/:id/attachments  — upload file/pdf attachment
router.post('/:id/attachments', auth, (req, res, next) => {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
}, uploadFile.single('file'), handleError, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const isPdf = req.file.mimetype === 'application/pdf' ||
      req.file.originalname.toLowerCase().endsWith('.pdf');

    const attachment = {
      name: req.body.name || req.file.originalname,
      url: req.file.path || req.file.secure_url,
      cloudinaryId: req.file.filename || req.file.public_id,
      type: isPdf ? 'pdf' : 'file',
      size: req.file.size,
    };

    notice.attachments.push(attachment);
    await notice.save();
    res.json({ attachment, attachments: notice.attachments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notices/:id/attachments/:attachmentId  — remove attachment
router.delete('/:id/attachments/:attachmentId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    const attachment = notice.attachments.id(req.params.attachmentId);
    if (!attachment) return res.status(404).json({ message: 'Attachment not found' });

    if (attachment.cloudinaryId) {
      try {
        const resourceType = attachment.type === 'pdf' ? 'raw' : 'image';
        await cloudinary.uploader.destroy(attachment.cloudinaryId, { resource_type: resourceType });
      } catch {}
    }

    notice.attachments.pull(req.params.attachmentId);
    await notice.save();
    res.json({ message: 'Attachment removed', attachments: notice.attachments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/notices/:id  — delete notice
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Clean up Cloudinary files
    if (notice.featuredImage?.cloudinaryId) {
      try { await cloudinary.uploader.destroy(notice.featuredImage.cloudinaryId); } catch {}
    }
    for (const att of notice.attachments) {
      try {
        const resourceType = att.type === 'pdf' ? 'raw' : 'image';
        await cloudinary.uploader.destroy(att.cloudinaryId, { resource_type: resourceType });
      } catch {}
    }

    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
