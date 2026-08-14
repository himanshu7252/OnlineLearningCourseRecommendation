const express = require('express');
const {
  updateLessonProgress,
  getCourseProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all progress logging

router.post('/', updateLessonProgress);
router.get('/:courseId', getCourseProgress);

module.exports = router;
