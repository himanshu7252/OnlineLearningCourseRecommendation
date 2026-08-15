const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

// @desc    Get all courses with search and filters
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const { category, level, skill, search } = req.query;
    let queryObj = {};

    // Apply filters
    if (category) {
      queryObj.category = category;
    }
    if (level) {
      queryObj.level = level;
    }
    if (skill) {
      queryObj.skills = { $in: [skill] };
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      queryObj.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { instructor: searchRegex },
      ];
    }

    const courses = await Course.find(queryObj);
    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course details by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'lessons',
      options: { sort: { order: 1 } }
    });

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course (Admin/Seed helper)
// @route   POST /api/courses
// @access  Private (Simulated as private, admin only)
const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample course catalog with lessons and quizzes
// @route   POST /api/courses/seed
// @access  Public (Simulated, utility endpoint)
const seedCourses = async (req, res, next) => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});

    // Sample Catalog
    const sampleCourses = [
      {
        title: "Complete React Native Development",
        description: "Learn to build high-performance native iOS and Android mobile apps from scratch using React Native, TypeScript, and Redux Toolkit.",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        instructor: "John Doe",
        category: "Mobile Development",
        level: "Intermediate",
        tags: ["React Native", "JavaScript", "TypeScript", "Mobile Development"],
        skills: ["React Native", "TypeScript", "Redux", "REST APIs", "Git"],
        duration: "12 Hours",
        price: 49.99,
        rating: 4.8,
        enrollmentCount: 1250,
        requirements: ["Basic React knowledge", "JavaScript fundamentals"],
      },
      {
        title: "Python for Data Science",
        description: "Master Python programming, NumPy, Pandas, Matplotlib, and Seaborn for data manipulation, analysis, and visualization.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        instructor: "Sarah Jenkins",
        category: "Data Science",
        level: "Beginner",
        tags: ["Python", "Data Science", "Pandas", "Matplotlib", "Statistics"],
        skills: ["Python", "Pandas", "NumPy", "Statistics", "Data Visualization"],
        duration: "8 Hours",
        price: 39.99,
        rating: 4.7,
        enrollmentCount: 3120,
        requirements: ["No programming experience required"],
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Dive deep into regression, classification, clustering, neural networks, and Scikit-Learn for building production AI models.",
        thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80",
        instructor: "Dr. Alan Turing",
        category: "AI & Machine Learning",
        level: "Advanced",
        tags: ["AI", "Machine Learning", "Python", "Data Science", "Neural Networks"],
        skills: ["Machine Learning", "Python", "Scikit-Learn", "Neural Networks", "AI"],
        duration: "15 Hours",
        price: 89.99,
        rating: 4.9,
        enrollmentCount: 1840,
        requirements: ["Python programming", "Basic linear algebra & calculus"],
      },
      {
        title: "Full Stack MERN Development",
        description: "Build robust web apps using MongoDB, Express.js, React.js, and Node.js. Includes authentication, REST APIs, and deployment.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
        instructor: "Jane Smith",
        category: "Web Development",
        level: "Intermediate",
        tags: ["MongoDB", "Express", "React", "Node", "JavaScript", "REST APIs"],
        skills: ["React", "JavaScript", "HTML", "CSS", "Node", "MongoDB", "REST APIs"],
        duration: "20 Hours",
        price: 59.99,
        rating: 4.6,
        enrollmentCount: 2450,
        requirements: ["HTML, CSS & basic JavaScript"],
      },
      {
        title: "Cybersecurity Fundamentals",
        description: "Learn network security, threat assessment, encryption standards, malware protection, and ethical hacking protocols.",
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
        instructor: "Kevin Mitnick",
        category: "Cybersecurity",
        level: "Beginner",
        tags: ["Cybersecurity", "Network Security", "Cryptography", "Ethical Hacking"],
        skills: ["Cybersecurity", "Network Security", "Cryptography", "Linux"],
        duration: "10 Hours",
        price: 29.99,
        rating: 4.5,
        enrollmentCount: 980,
        requirements: ["Basic computer usage literacy"],
      },
      {
        title: "Data Structures & Algorithms",
        description: "Crack the technical coding interview. Master lists, trees, graphs, sorting, searching, dynamic programming, and big-O notation.",
        thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
        instructor: "Donald Knuth",
        category: "Computer Science",
        level: "Advanced",
        tags: ["DSA", "Data Structures", "Algorithms", "Coding Interview"],
        skills: ["DSA", "Algorithms", "Problem Solving", "Java", "Python"],
        duration: "18 Hours",
        price: 79.99,
        rating: 4.9,
        enrollmentCount: 2150,
        requirements: ["Familiarity with at least one OOP language"],
      },
      {
        title: "Advanced JavaScript",
        description: "Unlock closures, prototypes, asynchronous event loops, promises, async/await, and ES6+ modules in-depth.",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
        instructor: "Kyle Simpson",
        category: "Web Development",
        level: "Advanced",
        tags: ["JavaScript", "ES6+", "Asynchronous JS", "Web Development"],
        skills: ["JavaScript", "ES6+", "Asynchronous JS"],
        duration: "6 Hours",
        price: 19.99,
        rating: 4.8,
        enrollmentCount: 1420,
        requirements: ["Basic JavaScript concepts"],
      },
      {
        title: "TypeScript Masterclass",
        description: "Write clean, type-safe, error-free applications. Master interfaces, generics, utility types, and strict configs.",
        thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
        instructor: "Anders Hejlsberg",
        category: "Web Development",
        level: "Intermediate",
        tags: ["TypeScript", "TypeScript Config", "TypeScript Generics"],
        skills: ["TypeScript", "TypeScript Generics", "JavaScript"],
        duration: "5 Hours",
        price: 24.99,
        rating: 4.7,
        enrollmentCount: 890,
        requirements: ["Solid JavaScript foundations"],
      },
      {
        title: "Cloud Computing Fundamentals",
        description: "Introduction to AWS, Azure, and Google Cloud services. Learn virtualization, IAM policies, and cloud hosting.",
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
        instructor: "Jeff Bezos",
        category: "Cloud Computing",
        level: "Beginner",
        tags: ["Cloud Computing", "AWS", "Azure", "Virtualization"],
        skills: ["Cloud Computing", "AWS", "Networking"],
        duration: "7 Hours",
        price: 34.99,
        rating: 4.4,
        enrollmentCount: 650,
        requirements: ["Basic IT and hardware knowledge"],
      },
      {
        title: "AI with Python",
        description: "Build intelligent computer agents. Cover Natural Language Processing, computer vision, and expert decision trees in Python.",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        instructor: "Sam Altman",
        category: "AI & Machine Learning",
        level: "Intermediate",
        tags: ["AI", "Python", "NLP", "Computer Vision", "AI with Python"],
        skills: ["AI", "Python", "NLP", "Computer Vision"],
        duration: "14 Hours",
        price: 69.99,
        rating: 4.7,
        enrollmentCount: 1120,
        requirements: ["Python programming", "Basic calculus"],
      }
    ];

    const seededCourses = await Course.insertMany(sampleCourses);

    // Seed Lessons and Quizzes for each course
    for (const c of seededCourses) {
      let lessonsToInsert = [];

      if (c.title === "Complete React Native Development") {
        lessonsToInsert = [
          { courseId: c._id, title: "Introduction & Setup", description: "Get started with Node, Java, and Android SDK configurations.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "10:15", order: 1, resources: ["https://reactnative.dev"] },
          { courseId: c._id, title: "Creating Components & StyleSheets", description: "Learn layout styling and flexbox mechanics.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "15:20", order: 2 },
          { courseId: c._id, title: "React Navigation Deep Dive", description: "Build stack, tab, and drawer navigators dynamically.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "20:30", order: 3 },
          { courseId: c._id, title: "State Management with Redux Toolkit", description: "Handle complex application state globally.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "25:45", order: 4 }
        ];
      } else if (c.title === "Python for Data Science") {
        lessonsToInsert = [
          { courseId: c._id, title: "Python Basics & Syntax", description: "Understand basic syntax, loops, and data structures.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "08:12", order: 1 },
          { courseId: c._id, title: "Introduction to NumPy", description: "Understand vectors, arrays, and matrix operations.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "12:15", order: 2 },
          { courseId: c._id, title: "Data Wrangling with Pandas", description: "Load, filter, and modify datasets easily.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "18:40", order: 3 }
        ];
      } else {
        // Fallback generic lessons for other courses
        lessonsToInsert = [
          { courseId: c._id, title: "Lesson 1: Introduction", description: `Overview of ${c.title}.`, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "09:30", order: 1 },
          { courseId: c._id, title: "Lesson 2: Core Concepts", description: `Deep dive into major elements of ${c.title}.`, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "14:20", order: 2 },
          { courseId: c._id, title: "Lesson 3: Advanced Applications", description: `Apply knowledge to real projects in ${c.title}.`, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", duration: "19:10", order: 3 }
        ];
      }

      const seededLessons = await Lesson.insertMany(lessonsToInsert);

      // Create a quiz for the first and second lesson of each course
      for (let i = 0; i < Math.min(seededLessons.length, 2); i++) {
        const lesson = seededLessons[i];
        let quizObj = {
          courseId: c._id,
          lessonId: lesson._id,
          title: `Quiz: ${lesson.title}`,
          passingScore: 70,
          questions: []
        };

        if (c.title === "Complete React Native Development" && lesson.order === 1) {
          quizObj.questions = [
            {
              question: "Which component is used as a standard box container in React Native?",
              options: ["<View>", "<Div>", "<Box>", "<Container>"],
              correctAnswer: "<View>",
              explanation: "The <View> component is the fundamental building block for UI structure, mimicking a web <div>."
            },
            {
              question: "Does React Native execute standard HTML elements natively?",
              options: ["Yes, out of the box", "No, it maps to native platform view primitives", "Only when building for Web", "Yes, but requires CSS"],
              correctAnswer: "No, it maps to native platform view primitives",
              explanation: "React Native transpiles JSX to native iOS/Android system elements, not Web standard elements."
            }
          ];
        } else if (c.title === "Complete React Native Development" && lesson.order === 2) {
          quizObj.questions = [
            {
              question: "How is styling implemented in React Native?",
              options: ["With external CSS files", "Via stylesheet tags in HTML", "Using StyleSheet.create() representing flex layouts", "Only inline styles"],
              correctAnswer: "Using StyleSheet.create() representing flex layouts",
              explanation: "StyleSheet.create() optimizes styles and compiles them directly into native styles using CSS-in-JS syntax."
            }
          ];
        } else {
          quizObj.questions = [
            {
              question: `This is a test question for ${lesson.title}. What is the correct answer?`,
              options: ["Option A (Correct)", "Option B", "Option C", "Option D"],
              correctAnswer: "Option A (Correct)",
              explanation: `Option A is the correct answer based on details covered in the lesson ${lesson.title}.`
            }
          ];
        }

        await Quiz.create(quizObj);
      }
    }

    res.json({
      success: true,
      message: "Database seeded successfully with 10 courses, detailed lessons, and quizzes.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  seedCourses,
};
