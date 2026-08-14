const express = require('express');
const {
  getPersonalizedRecommendations,
  getRelatedRecommendations,
  getSkillGapRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all recommendation services

router.get('/', getPersonalizedRecommendations);
router.get('/because-you-watched/:courseId', getRelatedRecommendations);
router.get('/skill-gap', getSkillGapRecommendations);

module.exports = router;
