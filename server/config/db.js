const mongoose = require('mongoose');

const connectDB = async () => {
  // Reuse existing connection if already established (critical for serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-learning-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't crash the serverless container in production, let Vercel handle the function error
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
