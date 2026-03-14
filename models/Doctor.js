const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  specialty: {
    type: String,
    required: [true, 'Please provide specialty'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide city'],
    trim: true
  },
  clinic: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  fee: {
    type: Number,
    required: [true, 'Please provide consultation fee'],
    min: 0
  },
  about: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other'
  },
  patientStories: {
    type: Number,
    default: 0
  },
  education: {
    type: String,
    default: ''
  },
  languages: {
    type: [String],
    default: []
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  timeSlots: [{
    time: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching
doctorSchema.index({ name: 'text', specialty: 'text', location: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);

