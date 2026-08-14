const express = require('express');
const {
  getQuizzesByCourse,
  submitQuizResponse,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure quiz operations

router.get('/:courseId', getQuizzesByCourse);
router.post('/:id/submit', submitQuizResponse);

module.exports = router;
