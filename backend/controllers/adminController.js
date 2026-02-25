const User = require('../models/User');
const Admin = require('../models/Admin');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
const registerAdmin = async (req, res) => {
    console.log('Admin Registration attempt:', req.body);
    const { fullname, email, password, designation } = req.body;

    try {
        const adminExists = await Admin.findOne({ email: email.toLowerCase() });
        if (adminExists) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }

        const admin = await Admin.create({
            fullname,
            email: email.toLowerCase(),
            password,
            designation,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        console.error('Admin Register error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
const authAdmin = async (req, res) => {
    console.log('Admin Login attempt:', req.body);
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        console.log('Admin lookup found:', admin ? 'Yes' : 'No');

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Admin Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system-wide stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'completed' });

        const performance = await Task.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$user', count: { $sum: 1 }, totalDuration: { $sum: '$duration' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { name: '$user.fullname', email: '$user.email', count: 1, totalDuration: 1 } }
        ]);

        res.json({
            totalUsers,
            totalTasks,
            completedTasks,
            performance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerAdmin, authAdmin, getUsers, getSystemStats };
