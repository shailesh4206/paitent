const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String,
    required: [true, 'Please provide appointment date']
  },
  time: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  type: {
    type: String,
    enum: ['in-person', 'video'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  symptoms: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  additionalServices: [{
    name: String,
    price: Number
  }],
  totalFee: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  videoLink: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
appointmentSchema.index({ doctor: 1, date: 1, time: 1 });
appointmentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

