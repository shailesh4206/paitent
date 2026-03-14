const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting multiple reviews for the same doctor
reviewSchema.index({ doctor: 1, user: 1 }, { unique: true });

// Calculate average rating and update doctor after saving review
reviewSchema.statics.calcAverageRating = async function(doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId }
    },
    {
      $group: {
        _id: '$doctor',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    const Doctor = require('./Doctor');
    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(doctorId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        patientStories: stats[0].nRating
      });
    }
  } catch (error) {
    console.error('Error updating doctor rating:', error);
  }
};

// Call calcAverageRating after saving
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.doctor);
});

// Call calcAverageRating after removing
reviewSchema.post('remove', function() {
  this.constructor.calcAverageRating(this.doctor);
});

module.exports = mongoose.model('Review', reviewSchema);

