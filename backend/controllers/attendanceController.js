const Attendance = require('../models/Attendance');
const Activity = require('../models/Activity');

// @desc    Start attendance login
// @route   POST /api/attendance/start
// @access  Private
const startAttendance = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Check if today's attendance already exists
        const existingAttendance = await Attendance.findOne({
            userId,
            date: today
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Attendance already marked for today." });
        }

        const attendance = await Attendance.create({
            userId,
            date: today,
            loginTime: now,
            status: "Present"
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to close attendance - used by Auth logout and optionally by the stop route
const closeAttendanceLogic = async (userId) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let attendance = await Attendance.findOne({
        userId,
        date: today,
        logoutTime: null
    });

    if (!attendance) {
        // Safety Handling: If no record exists, check for first activity or use session start
        const firstActivity = await Activity.findOne({
            user: userId,
            startTime: { $gte: today }
        }).sort({ startTime: 1 });

        attendance = await Attendance.create({
            userId,
            date: today,
            loginTime: firstActivity ? firstActivity.startTime : now,
            logoutTime: now,
            status: "Present"
        });
    } else {
        // Update existing open record
        attendance.logoutTime = now;
        attendance.status = "Present";
    }

    // Calculate workingHours
    const loginTime = new Date(attendance.loginTime);
    const logoutTime = new Date(attendance.logoutTime);
    const diffMs = logoutTime - loginTime;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    attendance.workingHours = `${hours}h ${minutes}m`;

    await attendance.save();
    return attendance;
};

// @desc    Stop attendance logout
// @route   POST /api/attendance/stop
// @access  Private
const stopAttendance = async (req, res) => {
    try {
        // The user now wants the Stop button to NOT update attendance.
        // We will return success but do nothing here to satisfy the requirement
        // while the frontend still calls this endpoint.
        res.json({ message: "Attendance stop ignored (moved to logout)" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({})
            .populate("userId", "fullname email name")
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user attendance
// @route   GET /api/attendance/:userId
// @access  Private
const getUserAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.params.userId })
            .populate("userId", "fullname email name")
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startAttendance,
    stopAttendance,
    getAllAttendance,
    getUserAttendance,
    closeAttendanceLogic
};

