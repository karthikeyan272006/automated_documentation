const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    console.log('Login attempt received:', req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User lookup found:', user ? 'Yes' : 'No');

        if (user && (await user.matchPassword(password))) {
            console.log('Login successful for:', email);
            res.json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            console.log('Login failed: Invalid email or password');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    console.log('Registration attempt received:', req.body);
    const { fullname, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });

        if (userExists) {
            console.log('Registration failed: User already exists');
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            fullname,
            email: email.toLowerCase(),
            password,
        });

        if (user) {
            console.log('Registration successful for:', email);
            res.status(201).json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            console.log('Registration failed: Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { authUser, registerUser };
