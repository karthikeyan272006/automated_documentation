const AppActivity = require('../models/AppActivity');

// @desc    Log application activity
// @route   POST /api/app-activity
// @access  Private
const logAppActivity = async (req, res) => {
    try {
        const { appName, windowTitle, url, startTime, endTime } = req.body;

        if (!appName || !startTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : new Date();
        const duration = Math.floor((end - start) / 1000);

        const activity = await AppActivity.create({
            user: req.user._id,
            appName,
            windowTitle,
            url,
            startTime: start,
            endTime: end,
            duration: duration > 0 ? duration : 0
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get today's app activity
// @route   GET /api/app-activity/today
// @access  Private
const getTodayAppActivity = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const activities = await AppActivity.find({
            user: req.user._id,
            startTime: { $gte: startOfDay }
        }).sort({ startTime: -1 });

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get app activity summary for dashboard
// @route   GET /api/app-activity/summary
// @access  Private
const getAppActivitySummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const summary = await AppActivity.aggregate([
            {
                $match: {
                    user: req.user._id,
                    startTime: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: '$appName',
                    totalDuration: { $sum: '$duration' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { totalDuration: -1 }
            }
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    logAppActivity,
    getTodayAppActivity,
    getAppActivitySummary
};
