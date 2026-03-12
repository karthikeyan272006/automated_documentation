const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Check if role matches if role is provided
        if (role && user.role !== role) {
            return res.status(401).json({ message: 'Invalid email id' });
        }

        res.json({
          _id: user._id,
          name: user.fullname || user.name,
          email: user.email,
          token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};


// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;
    

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email id. Please enter a valid email id." });
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least 6 characters, one uppercase letter and one special symbol"
        });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        fullname,
        email,
        password,
    });

      await sendEmail({
    email: user.email,
    subject: "Welcome to AutoDocs",
    message: `Hello ${fullname},
     Welcome to AutoDocs!
     Your Account has been Created Successfully.
     Thank you for joining us.
     - AutoDocs Team`
    
  });

  res.status(201).json({
    _id: user._id,
    name: user.fullname || user.name,
    email: user.email,
    token: generateToken(user._id)
  });

};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            fullname: user.fullname || user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Logout user & update attendance
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        const { closeAttendanceLogic } = require('./attendanceController');

        if (req.user) {
            await closeAttendanceLogic(req.user._id);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authUser, registerUser, getUserProfile, logoutUser, generateToken };

