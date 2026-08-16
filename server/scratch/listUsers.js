const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Fetching users...');
    
    const users = await User.find({}, 'name email');
    console.log('Registered Users:');
    if (users.length === 0) {
      console.log('No users found in the database!');
    } else {
      users.forEach(u => {
        console.log(`- Name: ${u.name}, Email: ${u.email}`);
      });
    }
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
