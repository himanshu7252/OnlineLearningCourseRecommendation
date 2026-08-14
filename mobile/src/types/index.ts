export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  skills: string[];
  interests: string[];
  learningGoals: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredCategories: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  resources: string[];
  createdAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  skills: string[];
  duration: string;
  price: number;
  rating: number;
  enrollmentCount: number;
  requirements: string[];
  lessons?: Lesson[];
  createdAt?: string;
}

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: Course; // populated in client view
  enrolledAt: string;
  completedAt?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  progressPercentage: number;
  lastAccessedLesson?: string;
  createdAt?: string;
}

export interface Progress {
  _id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  watchedDuration: number;
  quizScore?: number | null;
  completedAt?: string;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface QuizSubmissionResult {
  score: number;
  passed: boolean;
  passingScore: number;
  correctAnswersCount: number;
  totalQuestions: number;
  feedback: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface Recommendation {
  course: Course;
  score: number;
  reason: string;
  algorithm: string;
}

export interface SkillGap {
  role: string;
  skillsRequired: string[];
  userSkills: string[];
  missingSkills: string[];
  recommendations: {
    course: Course;
    matchCount: number;
    matchedSkills: string[];
    score: number;
    reason: string;
  }[];
}
