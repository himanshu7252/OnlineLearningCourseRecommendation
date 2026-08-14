const express = require('express');
const {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentById,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all enrollment actions

router.route('/')
  .post(enrollInCourse)
  .get(getUserEnrollments);

router.get('/:id', getEnrollmentById);

module.exports = router;
