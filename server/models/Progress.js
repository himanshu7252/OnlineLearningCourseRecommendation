const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
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
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    watchedDuration: {
      type: Number, // in seconds
      default: 0,
    },
    quizScore: {
      type: Number, // Optional score if lesson has a quiz
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index per user, course and lesson progress entry
ProgressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
