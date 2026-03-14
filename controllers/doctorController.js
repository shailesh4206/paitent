const Doctor = require('../models/Doctor');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const path = require('path');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

// ----------------- GET ALL DOCTORS -----------------
exports.getDoctors = async (req, res) => {
  try {
    const { specialty, location, search, gender, minExperience, maxFee } = req.query;
    let query = {};

    if (specialty && specialty !== 'All') query.specialty = specialty;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (gender) query.gender = gender;
    if (minExperience) query.experience = { $gte: parseInt(minExperience) };
    if (maxFee) query.fee = { $lte: parseInt(maxFee) };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialty: { $regex: search, $options: 'i' } }
    ];

    const doctors = await Doctor.find(query).sort({ rating: -1, createdAt: -1 });

    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- GET SINGLE DOCTOR -----------------
exports.getDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Handle demo doctor IDs
    if (doctorId.startsWith('demo-')) {
      // Find in demo data or return a simulated doctor
      // For now, we'll return a 404 but with a clear message, 
      // or we could return demo data if we had it here.
      // Better: let the frontend handle fallback if it gets 404.
      return res.status(404).json({ success: false, message: 'Demo doctor not found in database', isDemo: true });
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- CREATE DOCTOR -----------------
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- UPDATE DOCTOR -----------------
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    const doctor = await Doctor.findByIdAndUpdate(doctorId, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- DELETE DOCTOR -----------------
exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- GET SPECIALTIES -----------------
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json({ success: true, specialties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- UPLOAD IMAGE -----------------
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });
    const imagePath = path.join('uploads', req.file.filename);
    res.json({ success: true, imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- GET REVIEWS -----------------
exports.getDoctorReviews = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Handle demo doctor IDs
    if (doctorId.startsWith('demo-')) {
      return res.json({ success: true, count: 0, reviews: [], isDemo: true });
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    const reviews = await Review.find({ doctor: doctorId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- ADD REVIEW -----------------
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctorId = req.params.id;

    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }

    if (!rating || !comment || comment.length < 5 || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Provide valid rating (1-5) and comment (min 5 chars)' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const existingReview = await Review.findOne({ doctor: doctorId, user: req.user.id });
    if (existingReview) return res.status(400).json({ success: false, message: 'Already reviewed this doctor' });

    const review = await Review.create({ doctor: doctorId, user: req.user.id, rating, comment });
    await review.populate('user', 'name');

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- GET AVAILABILITY -----------------
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;
    
    // Handle demo doctor ID - return default available slots
    if (doctorId.startsWith('demo-')) {
      const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
      const availability = allTimeSlots.map(slot => ({ time: slot, available: true }));
      return res.json({ success: true, date, availability, isDemo: true });
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }
    
    if (!date) return res.status(400).json({ success: false, message: 'Provide a date' });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      // Return default availability if doctor not found
      const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
      const availability = allTimeSlots.map(slot => ({ time: slot, available: true }));
      return res.json({ success: true, date, availability });
    }

    const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
    
    const appointments = await Appointment.find({ doctor: doctorId, date, status: { $ne: 'cancelled' } });
    const bookedSlots = appointments.map(a => a.time);

    const availability = allTimeSlots.map(slot => ({ time: slot, available: !bookedSlots.includes(slot) }));
    res.json({ success: true, date, availability });
  } catch (error) {
    console.error(error);
    // Return default availability on error
    const allTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
    const availability = allTimeSlots.map(slot => ({ time: slot, available: true }));
    res.json({ success: true, date: req.query.date, availability });
  }
};

// ----------------- GENERATE VIDEO LINK -----------------
exports.generateVideoLink = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const doctorId = req.params.id;

    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID format' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const sessionId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const videoLink = `https://venecta.videoconsult.in/${sessionId}`;

    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { videoLink, type: 'video' });
    }

    res.json({ success: true, videoLink, sessionId, message: 'Video consultation link generated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

