const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// -------- PUBLIC ROUTES --------
// Signup a new user
router.post('/signup', signup);

// Login user
router.post('/login', login);

// -------- PROTECTED ROUTES --------
// Get logged-in user's profile
router.get('/me', protect, getMe);

// Update logged-in user's profile
router.put('/profile', protect, updateProfile);

// Export router
module.exports = router;
