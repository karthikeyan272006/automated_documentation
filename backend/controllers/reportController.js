const Report = require('../models/Report');
const Task = require('../models/Task');
// const { OpenAI } = require('openai'); // Uncomment for real AI

// Helper to generate heuristic summary
const generateSummary = (tasks, type) => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const totalDuration = tasks.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    return `
    ${type.charAt(0).toUpperCase() + type.slice(1)} Report Summary:
    --------------------------------------------------
    Productivity Overview:
    - Total Tasks Worked On: ${tasks.length}
    - Tasks Completed: ${completed}
    - Tasks Pending: ${pending}
    - Total Focus Time: ${hours}h ${minutes}m
    
    Key Achievements:
    ${tasks.filter(t => t.status === 'completed').map(t => `- Completed: ${t.title}`).join('\n    ')}
    
    Pending Items:
    ${tasks.filter(t => t.status === 'pending').map(t => `- Pending: ${t.title}`).join('\n    ')}
    
    Generated automatically by Automated Documentation Generator.
    `;
};

// @desc    Generate a new report
// @route   POST /api/reports
// @access  Private
const generateReport = async (req, res) => {
    const { type } = req.body; // daily, weekly, monthly

    try {
        const userId = req.user._id;
        const now = new Date();
        let startDate = new Date();

        if (type === 'daily') {
            startDate.setHours(0, 0, 0, 0);
        } else if (type === 'weekly') {
            startDate.setDate(now.getDate() - 7);
        } else if (type === 'monthly') {
            startDate.setMonth(now.getMonth() - 1);
        }

        const tasks = await Task.find({
            user: userId,
            updatedAt: { $gte: startDate }
        });

        const summaryText = generateSummary(tasks, type);

        const report = await Report.create({
            user: userId,
            type,
            summaryText
        });

        res.status(201).json(report);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateReport, getReports };
