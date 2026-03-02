const express = require('express');
const router = express.Router();
const {
    loginAttendance,
    logoutAttendance,
    getUserAttendance,
    getAllAttendance,
} = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Log attendance on login
router.post('/login', protect, loginAttendance);

// Log attendance on logout
router.post('/logout', protect, logoutAttendance);

// Get attendance for a specific user
router.get('/:userId', protect, getUserAttendance);

// Get all attendance records (Admin only)
router.get('/', protect, admin, getAllAttendance);

module.exports = router;
