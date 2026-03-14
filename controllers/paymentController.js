const crypto = require('crypto');

// Use Razorpay Dashboard -> Settings -> API Keys -> Test Secret for production
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Nt9n3kGugy7FzI9m'; // Test secret - replace with yours

// Verify Razorpay payment signature
exports.verifyPayment = (req, res) => {
  try {
    const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = req.body;

    if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details'
      });
    }

    // Create payload string for signature verification
    const payload = razorpay_order_id + '|' + razorpay_payment_id;
    
    // Generate signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

