const Task = require('../models/Task');
const moment = require('moment'); // You might need to install moment in backend if not present, otherwise use native Date

// Helper to format date start/end
const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const startOfToday = getStartOfDay(today);
        const endOfToday = getEndOfDay(today);

        // Daily Stats
        const dailyTasks = await Task.find({
            user: userId,
            updatedAt: { $gte: startOfToday, $lte: endOfToday }
        });

        const tasksCompletedToday = dailyTasks.filter(t => t.status === 'completed').length;
        const totalTimeToday = dailyTasks.reduce((acc, curr) => acc + (curr.duration || 0), 0);

        // Weekly Stats (Last 7 days)
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - 7);

        const weeklyTasks = await Task.find({
            user: userId,
            updatedAt: { $gte: getStartOfDay(startOfWeek), $lte: endOfToday }
        });

        // Group by day for chart
        const weeklyChartData = {};
        for (let d = 0; d < 7; d++) {
            const date = new Date();
            date.setDate(today.getDate() - d);
            const dateStr = date.toISOString().split('T')[0];
            weeklyChartData[dateStr] = 0;
        }

        weeklyTasks.forEach(task => {
            const dateStr = task.updatedAt.toISOString().split('T')[0];
            if (weeklyChartData[dateStr] !== undefined) {
                weeklyChartData[dateStr] += (task.duration || 0);
            }
        });

        res.json({
            daily: {
                tasksCompleted: tasksCompletedToday,
                totalTime: totalTimeToday,
                tasks: dailyTasks
            },
            weekly: {
                totalTime: weeklyTasks.reduce((acc, curr) => acc + (curr.duration || 0), 0),
                chartData: Object.entries(weeklyChartData).map(([date, time]) => ({ date, time })).reverse()
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
