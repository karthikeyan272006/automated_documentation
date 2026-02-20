const express = require('express');
const router = express.Router();
const {
    startActivity,
    stopActivity,
    getTodayActivities,
    getActiveActivity
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/start').post(protect, startActivity);
router.route('/stop').put(protect, stopActivity);
router.route('/today').get(protect, getTodayActivities);
router.route('/active').get(protect, getActiveActivity);

module.exports = router;
