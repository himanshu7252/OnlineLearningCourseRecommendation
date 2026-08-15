const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database (initiate connection early on cold start)
connectDB().catch((err) => console.error(`MongoDB Early Connection Error: ${err.message}`));

const app = express();

// Apply Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ensure database is connected before handling any requests (critical for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(new Error(`Database connection error: ${error.message}`));
  }
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Root diagnostic endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Online Learning & Course Recommendation System REST API!',
    documentation: 'See API details in repository docs/api.md',
  });
});

// Apply Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Export the App for Vercel Serverless functions
module.exports = app;

// Only start listening if not running inside the Vercel environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}
