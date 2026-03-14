const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecialties,
  uploadImage,
  getDoctorReviews,
  addReview,
  getDoctorAvailability,
  generateVideoLink
} = require('../controllers/doctorController');
const { protect, admin } = require('../middleware/auth');

// -------- Multer Setup --------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `doctor-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// -------- Public Routes --------
router.get('/specialties', getSpecialties); // FIXED route first
router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.get('/:id/reviews', getDoctorReviews);
router.get('/:id/availability', getDoctorAvailability);

// -------- Protected Routes (user) --------
router.post('/:id/reviews', protect, addReview);
router.post('/:id/video-link', protect, generateVideoLink);

// -------- Admin Routes --------
router.post('/', protect, admin, createDoctor);
router.put('/:id', protect, admin, updateDoctor);
router.delete('/:id', protect, admin, deleteDoctor);
router.post('/upload', protect, admin, upload.single('image'), uploadImage);

module.exports = router;