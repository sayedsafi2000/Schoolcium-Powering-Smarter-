# Cloudinary Setup Guide

## Configuration

The banner image upload system uses Cloudinary for image hosting. The following credentials are configured:

- **API Key**: `382733537575279`
- **API Secret**: `X8Lqo_AbMGsrSefDBzQk46aDJ40`

## Environment Variables

For production, you should set these as environment variables in your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=schoolcium-powering-smarter
CLOUDINARY_API_KEY=382733537575279
CLOUDINARY_API_SECRET=X8Lqo_AbMGsrSefDBzQk46aDJ40
```

## Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

This will install:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage adapter for Multer

## Features

### Banner Management Features:
- ✅ Upload banner images to Cloudinary
- ✅ Automatic image optimization (max 1920x1080, auto quality)
- ✅ Support for multiple image formats (JPG, PNG, GIF, WebP)
- ✅ Multiple banner positions (homepage, about, contact, gallery, other)
- ✅ Active/Inactive status toggle
- ✅ Display order management
- ✅ Start/End date scheduling
- ✅ Link URLs for banners
- ✅ Edit existing banners
- ✅ Delete banners (removes from Cloudinary automatically)
- ✅ Image preview before upload

### API Endpoints:

- `GET /api/banners` - Get all banners (Admin)
- `GET /api/banners/active` - Get active banners (Public, for website)
- `GET /api/banners/:id` - Get single banner
- `POST /api/banners` - Create new banner (Admin only)
- `POST /api/banners/upload` - Upload image only (Admin only)
- `PUT /api/banners/:id` - Update banner (Admin only)
- `PUT /api/banners/:id/image` - Update banner image (Admin only)
- `DELETE /api/banners/:id` - Delete banner (Admin only)

## Usage

1. **Access Banner Management**:
   - Login as admin
   - Navigate to "Banners" in the sidebar

2. **Create New Banner**:
   - Click "+ Add New Banner"
   - Fill in banner details
   - Upload image (max 5MB)
   - Set position, order, and dates
   - Click "Create Banner"

3. **Edit Banner**:
   - Click "Edit" on any banner
   - Modify details
   - Optionally upload new image
   - Click "Update Banner"

4. **Delete Banner**:
   - Click "Delete" on any banner
   - Confirm deletion
   - Image will be automatically removed from Cloudinary

## For Website Integration

To fetch banners for your public website:

```javascript
// Get all active banners
const response = await fetch('/api/banners/active');
const banners = await response.json();

// Get banners for specific position
const response = await fetch('/api/banners/active?position=homepage');
const homepageBanners = await response.json();
```

## Image Storage

All images are stored in Cloudinary under:
- Folder: `school-management/banners`
- Format: Optimized automatically
- Max dimensions: 1920x1080 (maintained aspect ratio)
- Quality: Auto-optimized

## Notes

- Only admin users can manage banners
- Images are automatically optimized by Cloudinary
- Old images are automatically deleted when updating/deleting banners
- Banner dates allow scheduling (start/end dates)
- Display order determines banner priority

