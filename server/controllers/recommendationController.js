const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Helper: Calculate intersection of two arrays
const getOverlap = (arr1, arr2) => {
  if (!arr1 || !arr2) return [];
  const lowercaseArr2 = arr2.map(item => item.toLowerCase());
  return arr1.filter(item => lowercaseArr2.includes(item.toLowerCase()));
};

// @desc    Get personalized hybrid recommendations
// @route   GET /api/recommendations
// @access  Private
const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // 1. Fetch all courses
    const allCourses = await Course.find({});

    // 2. Fetch user's existing enrollments (to filter them out)
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());

    // Filter out enrolled courses
    const candidateCourses = allCourses.filter(c => !enrolledCourseIds.includes(c._id.toString()));

    if (candidateCourses.length === 0) {
      return res.json({ success: true, count: 0, recommendations: [] });
    }

    // 3. Simple Collaborative Filtering: Find courses enrolled by similar users
    // Find users who have enrolled in any of the courses our target user is enrolled in
    let collaborativeScores = {}; // Map of courseId -> similarity score
    if (enrolledCourseIds.length > 0) {
      // Find other enrollments in the same courses
      const overlappingEnrollments = await Enrollment.find({
        courseId: { $in: enrolledCourseIds },
        userId: { $ne: userId }
      });

      const peerUserIds = [...new Set(overlappingEnrollments.map(e => e.userId.toString()))];

      if (peerUserIds.length > 0) {
        // Find other courses peer users enrolled in that the target user did not
        const peerEnrollments = await Enrollment.find({
          userId: { $in: peerUserIds },
          courseId: { $notin: enrolledCourseIds }
        });

        // Calculate count of peers enrolled in each candidate course
        peerEnrollments.forEach(pe => {
          const cId = pe.courseId.toString();
          if (!collaborativeScores[cId]) {
            collaborativeScores[cId] = 0;
          }
          collaborativeScores[cId] += 1;
        });

        // Normalize peer score by total peers
        Object.keys(collaborativeScores).forEach(cId => {
          collaborativeScores[cId] = collaborativeScores[cId] / peerUserIds.length;
        });
      }
    }

    // 4. Normalize course popularity metrics
    const maxEnrollments = Math.max(...allCourses.map(c => c.enrollmentCount || 0), 1);

    // 5. Score candidate courses
    const recommendationList = candidateCourses.map(course => {
      const courseIdStr = course._id.toString();

      // a. Interest Match (Level 1)
      const matchingInterests = getOverlap(user.interests, course.tags);
      const interestScore = user.interests.length > 0 
        ? matchingInterests.length / user.interests.length 
        : 0;

      // b. Skill Match (Level 2)
      const matchingSkills = getOverlap(user.skills, course.skills);
      // Score represents what fraction of the course skills overlap (or if user doesn't have them, we want to recommend skills they don't have yet, or match existing skills they want to advance)
      const skillScore = course.skills.length > 0 
        ? matchingSkills.length / course.skills.length 
        : 0;

      // c. Category Match
      const categoryScore = user.interests.some(interest => 
        interest.toLowerCase().includes(course.category.toLowerCase()) || 
        course.category.toLowerCase().includes(interest.toLowerCase())
      ) ? 1.0 : 0.0;

      // d. Difficulty Match
      let difficultyScore = 0.5; // Neutral
      if (user.experienceLevel === 'Beginner') {
        if (course.level === 'Beginner') difficultyScore = 1.0;
        else if (course.level === 'Intermediate') difficultyScore = 0.5;
        else if (course.level === 'Advanced') difficultyScore = 0.1;
      } else if (user.experienceLevel === 'Intermediate') {
        if (course.level === 'Intermediate') difficultyScore = 1.0;
        else if (course.level === 'Beginner') difficultyScore = 0.7;
        else if (course.level === 'Advanced') difficultyScore = 0.5;
      } else if (user.experienceLevel === 'Advanced') {
        if (course.level === 'Advanced') difficultyScore = 1.0;
        else if (course.level === 'Intermediate') difficultyScore = 0.8;
        else if (course.level === 'Beginner') difficultyScore = 0.4;
      }

      // e. Popularity Score
      const popularityScore = (course.enrollmentCount || 0) / maxEnrollments;

      // Combine for Content-Based Score (Level 3)
      const contentScore = (interestScore * 0.30) + 
                           (skillScore * 0.30) + 
                           (categoryScore * 0.20) + 
                           (difficultyScore * 0.10) + 
                           (popularityScore * 0.10);

      // f. Collaborative Filtering Score (Level 5)
      const collabScore = collaborativeScores[courseIdStr] || 0;

      // g. Hybrid Combination (Level 6)
      // If we have peer data, weight it 70% content / 30% collaborative, else 100% content
      const finalScore = enrolledCourseIds.length > 0 && Object.keys(collaborativeScores).length > 0
        ? (contentScore * 0.70) + (collabScore * 0.30)
        : contentScore;

      // h. Formulate readable justification
      let reasons = [];
      if (matchingInterests.length > 0) {
        reasons.push(`Matches your interest in ${matchingInterests.slice(0, 2).join(', ')}`);
      }
      if (matchingSkills.length > 0) {
        reasons.push(`Builds on your ${matchingSkills.slice(0, 2).join(', ')} skills`);
      }
      if (collabScore > 0) {
        reasons.push('Enrolled by students with similar learning profiles');
      }
      if (popularityScore > 0.6 && reasons.length < 2) {
        reasons.push('Trending topic on the platform');
      }
      if (reasons.length === 0) {
        reasons.push(`Suitable for ${course.level} learners in ${course.category}`);
      }

      return {
        course,
        score: parseFloat(finalScore.toFixed(3)),
        reason: reasons.join(' • '),
        algorithm: collabScore > 0 ? 'hybrid' : 'content-based',
      };
    });

    // Sort by recommendation score descending
    recommendationList.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      count: recommendationList.length,
      recommendations: recommendationList.slice(0, 6), // Top 6 recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get "Because You Watched..." recommendations (Level 4)
// @route   GET /api/recommendations/because-you-watched/:courseId
// @access  Private
const getRelatedRecommendations = async (req, res, next) => {
  try {
    const targetCourseId = req.params.courseId;
    const userId = req.user._id;

    const targetCourse = await Course.findById(targetCourseId);
    if (!targetCourse) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Find all courses excluding target course and currently enrolled courses
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());
    enrolledCourseIds.push(targetCourseId); // Exclude the reference course too

    const allCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });

    // Score based on similarity to target course tags and category
    const list = allCourses.map(course => {
      const overlappingTags = getOverlap(targetCourse.tags, course.tags);
      const tagScore = targetCourse.tags.length > 0 ? overlappingTags.length / targetCourse.tags.length : 0;
      const categoryScore = course.category.toLowerCase() === targetCourse.category.toLowerCase() ? 1.0 : 0.0;

      const score = (tagScore * 0.6) + (categoryScore * 0.4);

      return {
        course,
        score: parseFloat(score.toFixed(3)),
        reason: `Related topic: shares elements with ${targetCourse.title}`,
      };
    });

    // Filter score > 0 and sort
    const related = list
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Top 4 related

    res.json({
      success: true,
      count: related.length,
      recommendations: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate skill gap and recommend courses to fill it
// @route   GET /api/recommendations/skill-gap
// @access  Private
const getSkillGapRecommendations = async (req, res, next) => {
  try {
    const { role } = req.query; // e.g. "React Native Developer" or "Data Scientist"
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!role) {
      return res.status(400).json({ success: false, message: 'Please specify a target career role' });
    }

    // Hardcoded Industry Roles Requirements
    const roleRequirements = {
      'React Native Developer': ['React Native', 'TypeScript', 'Redux', 'REST APIs', 'Git', 'JavaScript'],
      'Data Scientist': ['Python', 'Pandas', 'NumPy', 'Statistics', 'Data Visualization', 'Machine Learning', 'Scikit-Learn'],
      'Full Stack Developer': ['React', 'JavaScript', 'HTML', 'CSS', 'Node', 'MongoDB', 'REST APIs', 'Git'],
      'AI Engineer': ['Python', 'Machine Learning', 'Neural Networks', 'AI', 'NLP', 'Computer Vision']
    };

    const targetSkills = roleRequirements[role];
    if (!targetSkills) {
      return res.status(400).json({ 
        success: false, 
        message: `Role not found. Available roles: ${Object.keys(roleRequirements).join(', ')}` 
      });
    }

    // Identify skills the user is missing
    const userSkillsLower = user.skills.map(s => s.toLowerCase());
    const missingSkills = targetSkills.filter(skill => !userSkillsLower.includes(skill.toLowerCase()));

    if (missingSkills.length === 0) {
      return res.json({
        success: true,
        role,
        skillsRequired: targetSkills,
        userSkills: user.skills,
        missingSkills: [],
        recommendations: [],
        message: `Congratulations! You already have all skills required for a ${role}.`
      });
    }

    // Recommend courses that cover these missing skills
    // Filter out courses the user is already enrolled in
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(e => e.courseId.toString());

    const candidateCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });

    const matchingRecommendations = candidateCourses.map(course => {
      const overlaps = getOverlap(missingSkills, course.skills);
      const score = overlaps.length / missingSkills.length;

      return {
        course,
        matchCount: overlaps.length,
        matchedSkills: overlaps,
        score: parseFloat(score.toFixed(3)),
        reason: `Teaches missing skill: ${overlaps.slice(0, 2).join(', ')}`
      };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

    res.json({
      success: true,
      role,
      skillsRequired: targetSkills,
      userSkills: user.skills,
      missingSkills,
      recommendations: matchingRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getRelatedRecommendations,
  getSkillGapRecommendations,
};
