const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll user in a course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({ userId, courseId });
    if (alreadyEnrolled) {
      res.status(400);
      throw new Error('You are already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
    });

    // Increment course popularity metric
    course.enrollmentCount += 1;
    await course.save();

    // Populate course details
    const populated = await enrollment.populate('courseId');

    res.status(201).json({
      success: true,
      enrollment: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's course enrollments
// @route   GET /api/enrollments
// @access  Private
const getUserEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId')
      .populate({
        path: 'courseId',
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } }
        }
      });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment detail by enrollment ID or course ID
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentById = async (req, res, next) => {
  try {
    // Can lookup by enrollment ID or Course ID
    let enrollment = await Enrollment.findOne({
      $or: [
        { _id: req.params.id, userId: req.user._id },
        { courseId: req.params.id, userId: req.user._id }
      ]
    }).populate('courseId');

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    res.json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
};
