const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

// @desc    Update progress for a single lesson
// @route   POST /api/progress
// @access  Private
const updateLessonProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId, completed, watchedDuration, quizScore } = req.body;
    const userId = req.user._id;

    if (!courseId || !lessonId) {
      res.status(400);
      throw new Error('Please provide courseId and lessonId');
    }

    // 1. Create or update progress entry
    let progress = await Progress.findOne({ userId, courseId, lessonId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        lessonId,
        completed: completed || false,
        watchedDuration: watchedDuration || 0,
        quizScore: quizScore !== undefined ? quizScore : null,
        completedAt: completed ? new Date() : null,
      });
    } else {
      if (completed !== undefined) {
        progress.completed = completed;
        if (completed && !progress.completedAt) {
          progress.completedAt = new Date();
        } else if (!completed) {
          progress.completedAt = null;
        }
      }
      if (watchedDuration !== undefined) {
        progress.watchedDuration = watchedDuration;
      }
      if (quizScore !== undefined) {
        progress.quizScore = quizScore;
      }
    }

    await progress.save();

    // 2. Recalculate overall course completion percentage
    const totalLessonsCount = await Lesson.countDocuments({ courseId });
    const completedLessonsCount = await Progress.countDocuments({
      userId,
      courseId,
      completed: true,
    });

    const progressPercentage = totalLessonsCount > 0 
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
      : 0;

    // 3. Update Enrollment status
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
      enrollment.progressPercentage = progressPercentage;
      enrollment.lastAccessedLesson = lessonId;

      if (progressPercentage === 100) {
        enrollment.status = 'COMPLETED';
        enrollment.completedAt = new Date();
      } else {
        enrollment.status = 'ACTIVE';
        enrollment.completedAt = null;
      }

      await enrollment.save();
    }

    res.json({
      success: true,
      progress,
      progressPercentage,
      completedLessons: completedLessonsCount,
      totalLessons: totalLessonsCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's progress for a specific course
// @route   GET /api/progress/:courseId
// @access  Private
const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progressList = await Progress.find({ userId, courseId });

    res.json({
      success: true,
      count: progressList.length,
      progress: progressList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateLessonProgress,
  getCourseProgress,
};
