const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
};

// CREATE APPOINTMENT
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, location, symptoms, type, additionalServices } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required"
      });
    }

    // Validate ObjectId format
    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }

    // Verify doctor exists in database
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Fee calculation
    let servicesTotal = 0;
    if (additionalServices && additionalServices.length > 0) {
      servicesTotal = additionalServices.reduce((sum, s) => {
        return sum + (s.price || 0);
      }, 0);
    }

    const doctorFee = doctor.fee;
    const totalFee = doctorFee + servicesTotal;

    // Check if slot already booked
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Generate video meeting link if type is "video"
    let videoLink = "";
    if (type === "video") {
      // Generate unique meeting room name using timestamp + random string
      const uniqueRoomName = `wealthiris-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      videoLink = `https://meet.jit.si/${uniqueRoomName}`;
    }

    // Create appointment in database
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      time,
      location: location || "",
      symptoms: symptoms || "",
      type: type || "in-person",
      additionalServices: additionalServices || [],
      totalFee,
      status: "confirmed",
      videoLink: videoLink
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialty fee location image")
      .populate("user", "name email phone");

    res.status(201).json({
      success: true,
      appointment: populated
    });

  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// GET MY APPOINTMENTS
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find({ user: req.user._id })
      .populate("doctor", "name specialty fee location image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error("GET APPOINTMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE APPOINTMENT
exports.getAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Validate ObjectId format
    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }
    
    const appointment = await Appointment
      .findById(appointmentId)
      .populate("doctor", "name specialty fee location image")
      .populate("user", "name email phone");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (
      appointment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    res.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error("GET APPOINTMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CANCEL APPOINTMENT
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Validate ObjectId format
    if (!isValidObjectId(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format"
      });
    }
    
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (
      appointment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled",
      appointment
    });

  } catch (error) {
    console.error("CANCEL APPOINTMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN - GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment
      .find()
      .populate("doctor", "name specialty fee location")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error("GET ALL APPOINTMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

