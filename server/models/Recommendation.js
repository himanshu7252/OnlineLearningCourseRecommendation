const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    algorithm: {
      type: String,
      enum: ['interest-based', 'skill-based', 'content-based', 'collaborative', 'hybrid', 'because-you-watched', 'skill-gap'],
      default: 'hybrid',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate recommendation records for a user and course
RecommendationSchema.index({ userId: 1, courseId: 1, algorithm: 1 }, { unique: true });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
