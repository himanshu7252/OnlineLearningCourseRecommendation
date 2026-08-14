const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length >= 2, 'A question must have at least 2 options'],
  },
  correctAnswer: {
    type: String, // Stores the text of the correct option or index (e.g. "B" or "useEffect")
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const QuizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson', // Optional: if null, it's a final course quiz
    },
    title: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
    passingScore: {
      type: Number,
      default: 70, // percentage e.g. 70%
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', QuizSchema);
