const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboard,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  updateProfile,
  getProfile,
  addMedicalHistory,
  addAllergy,
  removeAllergy
} = require('../controllers/patientController');

// All routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getDashboard);

// Appointments
router.get('/appointments', getMyAppointments);
router.get('/appointments/:id', getAppointmentById);
router.put('/appointments/:id/cancel', cancelAppointment);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Medical History
router.post('/medical-history', addMedicalHistory);

// Allergies
router.post('/allergies', addAllergy);
router.delete('/allergies', removeAllergy);

module.exports = router;

