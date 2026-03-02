const Attendance = require('../models/Attendance');
const moment = require('moment'); // Using moment for easy date/time manipulation if available, otherwise native Date. Let's check package.json.
const User = require('../models/User');

/**
 * @desc    Log attendance in (on login)
 * @route   POST /api/attendance/login
 * @access  Private
 */
const loginAttendance = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

        // Check if attendance already exists for today
        const existingAttendance = await Attendance.findOne({ userId, date: currentDate });

        if (existingAttendance) {
            return res.status(200).json({
                message: 'Attendance already marked for today',
                attendance: existingAttendance
            });
        }

        // Determine status (Let's assume cutoff is 09:30 AM)
        let status = 'Present';
        const cutoffTime = new Date(now);
        cutoffTime.setHours(9, 30, 0, 0);

        if (now > cutoffTime) {
            status = 'Late';
        }

        const attendance = await Attendance.create({
            userId,
            date: currentDate,
            loginTime: now,
            status,
        });

        res.status(201).json(attendance);
    } catch (error) {
        console.error('Error in loginAttendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc    Log attendance out (on logout)
 * @route   POST /api/attendance/logout
 * @access  Private
 */
const logoutAttendance = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ userId, date: currentDate });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found for today' });
        }

        if (attendance.logoutTime) {
            return res.status(200).json({ message: 'Already logged out', attendance });
        }

        attendance.logoutTime = now;

        // Calculate work hours
        const diffMs = now - attendance.loginTime;
        const diffHrs = (diffMs / (1000 * 60 * 60)).toFixed(2);
        attendance.workHours = diffHrs.toString();

        await attendance.save();

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error in logoutAttendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc    Get attendance for a specific user
 * @route   GET /api/attendance/:userId
 * @access  Private
 */
const getUserAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        // Ensure user can only see their own attendance, unless they are admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const attendanceRecords = await Attendance.find({ userId })
            .populate('userId', 'fullname email')
            .sort({ createdAt: -1 });

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error in getUserAttendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc    Get all attendance records (Admin only)
 * @route   GET /api/attendance
 * @access  Private/Admin
 */
const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({})
            .populate('userId', 'fullname email')
            .sort({ createdAt: -1 });

        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error('Error in getAllAttendance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    loginAttendance,
    logoutAttendance,
    getUserAttendance,
    getAllAttendance,
};
