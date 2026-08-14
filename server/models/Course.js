const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      required: [true, 'Please add an instructor name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Please add a level'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    tags: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    duration: {
      type: String, // e.g. "12 Hours" or "45 Minutes"
      required: [true, 'Please add duration'],
    },
    price: {
      type: Number,
      default: 0, // Free or paid
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    enrollmentCount: {
      type: Number,
      default: 0, // Used for popularity score
    },
    requirements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for lessons
CourseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false,
});

module.exports = mongoose.model('Course', CourseSchema);
