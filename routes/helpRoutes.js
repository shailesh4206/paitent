const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicket,
  getAllTickets
} = require('../controllers/helpController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', createTicket);

// Protected routes
router.get('/', protect, getMyTickets);
router.get('/admin/all', protect, admin, getAllTickets);
router.get('/:id', protect, getTicket);

module.exports = router;

