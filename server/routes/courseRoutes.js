const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  seedCourses,
} = require('../controllers/courseController');

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.post('/seed', seedCourses);
router.get('/:id', getCourseById);

module.exports = router;
