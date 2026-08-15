const mongoose = require('mongoose');

// Cache the connection promise to reuse it across serverless function invocations
let cachedPromise = null;

const connectDB = async () => {
  // If the database is already connected, return the connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If the connection is currently being established, wait for the existing promise
  if (mongoose.connection.readyState === 2 && cachedPromise) {
    return cachedPromise;
  }

  const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/online-learning-db';

  cachedPromise = mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds instead of 10s or buffering indefinitely
  });

  try {
    const conn = await cachedPromise;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null; // Reset cached promise on failure so next request can retry connecting
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
