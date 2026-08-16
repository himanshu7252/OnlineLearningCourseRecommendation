const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforrecommendationapp123!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          skills: user.skills,
          interests: user.interests,
          learningGoals: user.learningGoals,
          experienceLevel: user.experienceLevel,
          preferredCategories: user.preferredCategories,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User does not exist');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Incorrect password');
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        interests: user.interests,
        learningGoals: user.learningGoals,
        experienceLevel: user.experienceLevel,
        preferredCategories: user.preferredCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // req.user was populated in protect middleware
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile / onboarding answers
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    if (req.body.skills) user.skills = req.body.skills;
    if (req.body.interests) user.interests = req.body.interests;
    if (req.body.learningGoals) user.learningGoals = req.body.learningGoals;
    if (req.body.experienceLevel) user.experienceLevel = req.body.experienceLevel;
    if (req.body.preferredCategories) user.preferredCategories = req.body.preferredCategories;
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        learningGoals: updatedUser.learningGoals,
        experienceLevel: updatedUser.experienceLevel,
        preferredCategories: updatedUser.preferredCategories,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send 6-digit OTP email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User does not exist');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email
    const subject = 'EduRec - Password Reset OTP';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #6366f1; text-align: center;">EduRec Course Recommender</h2>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 16px; color: #334155;">Hello ${user.name},</p>
        <p style="font-size: 16px; color: #334155;">You requested to reset your password. Use the following 6-digit One-Time Password (OTP) to complete the verification:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; font-size: 28px; font-weight: bold; letter-spacing: 4px; text-align: center; color: #1e293b; margin: 25px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #64748b;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; ${new Date().getFullYear()} EduRec. All rights reserved.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject,
        message: `Your password reset verification code is: ${otp}. It is valid for 10 minutes.`,
        html,
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
      });
    } catch (err) {
      console.error('Email send error:', err);
      // Clean up user model fields if send email fails
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();

      res.status(500);
      throw new Error(err.message || 'Failed to send verification email. Please try again.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Please provide email, OTP, and new password');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Set new password (pre-save hook will encrypt it automatically)
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
