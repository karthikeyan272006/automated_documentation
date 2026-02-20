const Activity = require('../models/Activity');
const Task = require('../models/Task');

// @desc    Start an activity
// @route   POST /api/activities/start
// @access  Private
const startActivity = async (req, res) => {
    try {
        const { task, activityType, description } = req.body;

        // Check if there's already an active activity for this user
        const activeActivity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false }
        });

        if (activeActivity) {
            // Stop the previous one first
            activeActivity.endTime = new Date();
            activeActivity.duration = Math.floor((activeActivity.endTime - activeActivity.startTime) / 1000);
            await activeActivity.save();
        }

        const activity = await Activity.create({
            user: req.user._id,
            task,
            activityType,
            description,
            startTime: new Date()
        });

        // Emit socket event for real-time dashboard update
        const io = req.app.get('socketio');
        if (io) {
            io.emit('activity_update', {
                userId: req.user._id,
                status: 'Active',
                activityType,
                startTime: activity.startTime
            });
        }

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stop currently active activity
// @route   PUT /api/activities/stop
// @access  Private
const stopActivity = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false }
        });

        if (!activity) {
            return res.status(404).json({ message: 'No active activity found' });
        }

        activity.endTime = new Date();
        activity.duration = Math.floor((activity.endTime - activity.startTime) / 1000);
        await activity.save();

        // Emit socket event for real-time dashboard update
        const io = req.app.get('socketio');
        if (io) {
            io.emit('activity_update', {
                userId: req.user._id,
                status: 'Idle',
                endTime: activity.endTime
            });
        }

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user activities for today
// @route   GET /api/activities/today
// @access  Private
const getTodayActivities = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const activities = await Activity.find({
            user: req.user._id,
            startTime: { $gte: startOfDay }
        }).sort({ startTime: -1 }).populate('task');

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active activity
// @route   GET /api/activities/active
// @access  Private
const getActiveActivity = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false }
        }).populate('task');

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startActivity,
    stopActivity,
    getTodayActivities,
    getActiveActivity
};
