const express = require('express');
const router = express.Router();
const {
    startActivity,
    stopActivity,
    getTodayActivities,
    getActiveActivity,
    logActivity
} = require('../controllers/activityController');

const { protect } = require('../middleware/authMiddleware');

router.route('/start').post(protect, startActivity);
router.route('/stop').put(protect, stopActivity);
router.route('/today').get(protect, getTodayActivities);
router.route('/active').get(protect, getActiveActivity);
router.route('/log').post(protect, logActivity);


module.exports = router;
