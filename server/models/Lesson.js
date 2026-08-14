const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a lesson title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    duration: {
      type: String, // e.g. "10:15"
      default: '0:00',
    },
    order: {
      type: Number,
      required: true,
    },
    resources: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate orders for a single course
LessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', LessonSchema);
