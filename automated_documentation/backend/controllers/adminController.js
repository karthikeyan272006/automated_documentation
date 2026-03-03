const User = require('../models/User');
const Task = require('../models/Task');

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

        // Simple aggregation for leaderboard/performance
        const performance = await Task.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$user', count: { $sum: 1 }, totalDuration: { $sum: '$duration' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { name: '$user.name', email: '$user.email', count: 1, totalDuration: 1 } }
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

module.exports = { getUsers, getSystemStats };
