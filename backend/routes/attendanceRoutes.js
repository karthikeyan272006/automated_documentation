const express = require('express');
const router = express.Router();
const {
    startAttendance,
    stopAttendance,
    getAllAttendance,
    getUserAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllAttendance);
router.post('/start', protect, startAttendance);
router.post('/stop', protect, stopAttendance);
router.get('/:userId', protect, getUserAttendance);

module.exports = router;

