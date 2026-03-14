const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payment/verify - Verify Razorpay payment signature (no auth needed)
router.post('/verify', paymentController.verifyPayment);

module.exports = router;

