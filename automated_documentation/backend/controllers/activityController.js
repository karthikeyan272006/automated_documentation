const Activity = require('../models/Activity');
const Task = require('../models/Task');

// @desc    Start an activity
// @route   POST /api/activities/start
// @access  Private
const startActivity = async (req, res) => {
    try {
        console.log('Backend: startActivity called by user:', req.user._id);
        const { task, activityType, description } = req.body;
        console.log('Backend: Data received:', { task, activityType, description });

        // Check if there's already an active activity for this user
        const activeActivity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false }
        });

        if (activeActivity) {
            console.log('Backend: Found existing active activity, stopping it:', activeActivity._id);
            activeActivity.endTime = new Date();
            activeActivity.duration = Math.floor((activeActivity.endTime - activeActivity.startTime) / 1000);
            await activeActivity.save();
            console.log('Backend: Previous activity stopped.');
        }

        const activity = await Activity.create({
            user: req.user._id,
            task,
            activityType,
            description,
            startTime: new Date(),
            status: 'Running'
        });

        console.log('Backend: New activity created:', activity._id);

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
        console.error('Backend: Error in startActivity:', error);
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

        const currentStatus = activity.status;
        activity.endTime = new Date();
        activity.status = 'Stopped';

        let initialDuration = Math.floor((activity.endTime - activity.startTime) / 1000);
        let finalPausedTime = activity.totalPausedTime;

        if (currentStatus === 'Paused' && activity.pausedAt) {
            finalPausedTime += Math.floor((activity.endTime - activity.pausedAt) / 1000);
        }

        activity.duration = initialDuration - finalPausedTime;
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

// @desc    Log activity from tracker
// @route   POST /api/activities/log
// @access  Private
const logActivity = async (req, res) => {
    try {
        const { appName, activityLevel, keyboardCount, mouseCount, screenshot, location } = req.body;

        const activeActivity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false }
        });

        if (activeActivity) {
            // Update the current active activity with latest metrics
            activeActivity.appName = appName || activeActivity.appName;
            activeActivity.activityLevel = activityLevel || activeActivity.activityLevel;
            activeActivity.keyboardCount = (activeActivity.keyboardCount || 0) + (keyboardCount || 0);
            activeActivity.mouseCount = (activeActivity.mouseCount || 0) + (mouseCount || 0);
            if (screenshot) activeActivity.screenshot = screenshot; // In a real app, save base64 to file
            if (location) activeActivity.location = location;

            await activeActivity.save();

            // Emit update for real-time dashboard
            const io = req.app.get('socketio');
            if (io) {
                io.emit('activity_realtime', {
                    userId: req.user._id,
                    appName,
                    activityLevel,
                    screenshot: screenshot ? true : false
                });
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pause an activity
// @route   PUT /api/activities/pause
// @access  Private
const pauseActivity = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false },
            status: 'Running'
        });

        if (!activity) {
            return res.status(404).json({ message: 'No active running activity found' });
        }

        activity.status = 'Paused';
        activity.pausedAt = new Date();
        await activity.save();

        const io = req.app.get('socketio');
        if (io) {
            io.emit('activity_update', {
                userId: req.user._id,
                status: 'Paused',
                pausedAt: activity.pausedAt
            });
        }

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resume an activity
// @route   PUT /api/activities/resume
// @access  Private
const resumeActivity = async (req, res) => {
    try {
        const activity = await Activity.findOne({
            user: req.user._id,
            endTime: { $exists: false },
            status: 'Paused'
        });

        if (!activity) {
            return res.status(404).json({ message: 'No paused activity found' });
        }

        const now = new Date();
        const pauseDuration = Math.floor((now - activity.pausedAt) / 1000);

        activity.totalPausedTime += pauseDuration;
        activity.status = 'Running';
        activity.pausedAt = undefined;
        await activity.save();

        const io = req.app.get('socketio');
        if (io) {
            io.emit('activity_update', {
                userId: req.user._id,
                status: 'Running',
                totalPausedTime: activity.totalPausedTime
            });
        }

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startActivity,
    stopActivity,
    getTodayActivities,
    getActiveActivity,
    logActivity,
    pauseActivity,
    resumeActivity
};

