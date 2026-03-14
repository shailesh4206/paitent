const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

// Get patient dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get upcoming appointments
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = await Appointment.find({
      user: userId,
      date: { $gte: today },
      status: { $nin: ['cancelled'] }
    })
    .populate('doctor', 'name specialty experience rating location image')
    .sort({ date: 1, time: 1 })
    .limit(5);
    
    // Get past appointments count
    const pastAppointmentsCount = await Appointment.countDocuments({
      user: userId,
      date: { $lt: today },
      status: 'completed'
    });
    
    // Get total appointments
    const totalAppointments = await Appointment.countDocuments({
      user: userId,
      status: { $nin: ['cancelled'] }
    });
    
    // Get cancelled appointments count
    const cancelledCount = await Appointment.countDocuments({
      user: userId,
      status: 'cancelled'
    });
    
    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address,
          emergencyContact: user.emergencyContact,
          medicalHistory: user.medicalHistory,
          allergies: user.allergies,
          avatar: user.avatar
        },
        stats: {
          upcoming: upcomingAppointments.length,
          total: totalAppointments,
          completed: pastAppointmentsCount,
          cancelled: cancelledCount
        },
        upcomingAppointments
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all patient appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;
    
    // Build query
    let query = { user: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialty experience rating location image fee')
      .sort({ date: -1, time: -1 });
    
    // Separate upcoming and past
    const today = new Date().toISOString().split('T')[0];
    const upcoming = appointments.filter(apt => apt.date >= today && apt.status !== 'cancelled');
    const past = appointments.filter(apt => apt.date < today || apt.status === 'cancelled' || apt.status === 'completed');
    
    res.json({
      success: true,
      data: {
        upcoming,
        past,
        all: appointments
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single appointment details
exports.getAppointmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID format' });
    }
    
    const appointment = await Appointment.findOne({ _id: id, user: userId })
      .populate('doctor', 'name specialty experience rating location image fee');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID format' });
    }
    
    const appointment = await Appointment.findOne({ _id: id, user: userId });
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, dateOfBirth, gender, address, emergencyContact, medicalHistory, allergies } = req.body;
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (address) updateData.address = address;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (medicalHistory) updateData.medicalHistory = medicalHistory;
    if (allergies) updateData.allergies = allergies;
    
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('=== GET PROFILE DEBUG ===');
    console.log('Request user ID:', userId);
    console.log('Request user ID type:', typeof userId);
    console.log('Request user _id:', req.user._id);
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      console.log('Invalid user ID format:', userId);
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId);
    console.log('Found user:', user ? user.name : 'NOT FOUND');
    console.log('Found user ID:', user ? user._id : 'N/A');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get appointment stats
    const today = new Date().toISOString().split('T')[0];
    const totalAppointments = await Appointment.countDocuments({ user: userId });
    const completedAppointments = await Appointment.countDocuments({ user: userId, status: 'completed' });
    const upcomingAppointments = await Appointment.countDocuments({
      user: userId,
      date: { $gte: today },
      status: { $nin: ['cancelled'] }
    });
    
    res.json({
      success: true,
      data: {
        user,
        stats: {
          total: totalAppointments,
          completed: completedAppointments,
          upcoming: upcomingAppointments
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add medical history entry
exports.addMedicalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { condition, diagnosedDate, notes } = req.body;
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.medicalHistory.push({ condition, diagnosedDate, notes });
    await user.save();
    
    res.json({
      success: true,
      message: 'Medical history added successfully',
      data: user.medicalHistory
    });
  } catch (error) {
    console.error('Add medical history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add allergy
exports.addAllergy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { allergy } = req.body;
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (!user.allergies.includes(allergy)) {
      user.allergies.push(allergy);
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Allergy added successfully',
      data: user.allergies
    });
  } catch (error) {
    console.error('Add allergy error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove allergy
exports.removeAllergy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { allergy } = req.body;
    
    // Validate ObjectId format
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.allergies = user.allergies.filter(a => a !== allergy);
    await user.save();
    
    res.json({
      success: true,
      message: 'Allergy removed successfully',
      data: user.allergies
    });
  } catch (error) {
    console.error('Remove allergy error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

