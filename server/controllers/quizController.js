const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

// @desc    Get quizzes for a specific course or lesson
// @route   GET /api/quizzes/:courseId
// @access  Private
const getQuizzesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.query;

    let queryObj = { courseId };
    if (lessonId) {
      queryObj.lessonId = lessonId;
    }

    const quizzes = await Quiz.find(queryObj);

    res.json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answers for scoring and update lesson/course progress
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuizResponse = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of option strings matching the question sequence
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const feedback = [];

    quiz.questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) {
        correctCount += 1;
      }

      feedback.push({
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= quiz.passingScore;

    // If quiz is lesson-specific, log it in progress and update course enrollment
    if (quiz.lessonId) {
      let progress = await Progress.findOne({ userId, courseId: quiz.courseId, lessonId: quiz.lessonId });
      
      if (!progress) {
        progress = new Progress({
          userId,
          courseId: quiz.courseId,
          lessonId: quiz.lessonId,
          completed: passed, // complete only if passed
          watchedDuration: 0,
          quizScore: scorePercentage,
          completedAt: passed ? new Date() : null,
        });
      } else {
        progress.quizScore = scorePercentage;
        if (passed) {
          progress.completed = true;
          if (!progress.completedAt) {
            progress.completedAt = new Date();
          }
        }
      }
      await progress.save();

      // Trigger enrollment progress updates
      const totalLessonsCount = await Lesson.countDocuments({ courseId: quiz.courseId });
      const completedLessonsCount = await Progress.countDocuments({
        userId,
        courseId: quiz.courseId,
        completed: true,
      });

      const progressPercentage = totalLessonsCount > 0 
        ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
        : 0;

      const enrollment = await Enrollment.findOne({ userId, courseId: quiz.courseId });
      if (enrollment) {
        enrollment.progressPercentage = progressPercentage;
        enrollment.lastAccessedLesson = quiz.lessonId;
        if (progressPercentage === 100) {
          enrollment.status = 'COMPLETED';
          enrollment.completedAt = new Date();
        }
        await enrollment.save();
      }
    }

    res.json({
      success: true,
      score: scorePercentage,
      passed,
      passingScore: quiz.passingScore,
      correctAnswersCount: correctCount,
      totalQuestions,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuizzesByCourse,
  submitQuizResponse,
};
