const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Banner = require('../models/Banner');
const { auth } = require('../middleware/auth');

// Configure Cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'domn2k79e';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || '382733537575279',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'X8Lqo_AbMGsrSefDBzQk46aDJ40',
  secure: true,
  api_proxy: process.env.CLOUDINARY_API_PROXY
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Return sync params instead of async
    return {
      folder: 'school-management/banners',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
      ],
      resource_type: 'image',
      use_filename: true,
      unique_filename: true
    };
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB for form fields
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/banners
// @desc    Get all banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { position, active } = req.query;
    const query = {};
    
    if (position) {
      query.position = position;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate('createdBy', 'username');
    
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/banners/active
// @desc    Get active banners only (for public website)
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const { position } = req.query;
    const query = { isActive: true };
    
    if (position) {
      query.position = position;
    }
    
    // Check if banner is within date range if dates are set
    const now = new Date();
    const banners = await Banner.find(query)
      .where('startDate').lte(now).or([{ startDate: null }, { startDate: { $exists: false } }])
      .where('endDate').gte(now).or([{ endDate: null }, { endDate: { $exists: false } }])
      .sort({ order: 1, createdAt: -1 })
      .select('-cloudinaryId -createdBy -createdAt -updatedAt');
    
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/banners/:id
// @desc    Get single banner
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/banners
// @desc    Create new banner (Admin only)
// @access  Private (Admin)
// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error) {
    // Check if it's a Cloudinary error
    const errorMsg = error.message || '';
    const isCloudinaryError = errorMsg.includes('Invalid cloud_name') || 
                              errorMsg.includes('cloud_name') ||
                              errorMsg.includes('Unauthorized') ||
                              error.name === 'CloudinaryError';
    
    if (isCloudinaryError) {
      return res.status(400).json({ 
        message: error.message || 'Invalid Cloudinary configuration',
        error: 'Cloudinary rejected the upload',
        possibleCauses: [
          'Cloud name might not exist',
          'API Key might not belong to this cloud name',
          'API Secret might not match the API Key'
        ],
        solution: [
          'Please verify your Cloudinary credentials',
          'All three values (cloud_name, api_key, api_secret) must belong to the same account.'
        ],
      });
    }
    return res.status(400).json({ 
      message: error.message || 'File upload error'
    });
  }
  next();
};

router.post('/', auth, (req, res, next) => {
  // Set timeout for the request (2 minutes)
  req.setTimeout(120000);
  res.setTimeout(120000);
  next();
}, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    
    // Parse form data - multer puts form fields in req.body
    const title = req.body.title;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const description = req.body.description || '';
    const position = req.body.position || 'homepage';
    const order = parseInt(req.body.order) || 0;
    const link = req.body.link || '';
    const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : null;
    const isActive = req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : true;
    
    // multer-storage-cloudinary returns: path (secure URL), filename (public_id)
    const imageUrl = req.file.path;
    const cloudinaryId = req.file.filename;
    
    if (!imageUrl) {
      return res.status(500).json({ 
        message: 'Failed to get image URL from Cloudinary'
      });
    }
    
    const banner = new Banner({
      title,
      description,
      imageUrl,
      cloudinaryId,
      position,
      order,
      link,
      startDate,
      endDate,
      isActive,
      createdBy: req.user.id
    });
    
    await banner.save();
    await banner.populate('createdBy', 'username');
    
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Error creating banner'
    });
  }
});

// @route   POST /api/banners/upload
// @desc    Upload banner image (Admin only)
// @access  Private (Admin)
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    
    // Cloudinary file structure
    const imageUrl = req.file.secure_url || req.file.url || req.file.path;
    const cloudinaryId = req.file.public_id || req.file.filename;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
      cloudinaryId,
      publicId: cloudinaryId
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Error uploading image'
    });
  }
});

// @route   PUT /api/banners/:id
// @desc    Update banner (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { title, description, position, order, link, startDate, endDate, isActive } = req.body;
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    banner.title = title || banner.title;
    banner.description = description !== undefined ? description : banner.description;
    banner.position = position || banner.position;
    banner.order = order !== undefined ? order : banner.order;
    banner.link = link !== undefined ? link : banner.link;
    banner.startDate = startDate ? new Date(startDate) : banner.startDate;
    banner.endDate = endDate ? new Date(endDate) : banner.endDate;
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;
    
    await banner.save();
    await banner.populate('createdBy', 'username');
    
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/banners/:id/image
// @desc    Update banner image (Admin only)
// @access  Private (Admin)
router.put('/:id/image', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    // Delete old image from Cloudinary
    try {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
    } catch (error) {
      // Ignore delete errors
    }
    
    // Update banner with new image - Cloudinary file structure
    banner.imageUrl = req.file.secure_url || req.file.url || req.file.path;
    banner.cloudinaryId = req.file.public_id || req.file.filename;
    
    await banner.save();
    await banner.populate('createdBy', 'username');
    
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/banners/:id
// @desc    Delete banner (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(banner.cloudinaryId);
    } catch (error) {
      // Ignore delete errors
    }
    
    await banner.deleteOne();
    
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

