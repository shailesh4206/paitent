const HelpTicket = require('../models/HelpTicket');

// @desc    Create new help ticket
// @route   POST /api/help
// @access  Public
exports.createTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const ticket = await HelpTicket.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all help tickets (user's own tickets)
// @route   GET /api/help
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    
    const tickets = await HelpTicket.find({ email: userEmail })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/help/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await HelpTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all tickets (admin)
// @route   GET /api/help/admin/all
// @access  Private/Admin
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await HelpTicket.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

