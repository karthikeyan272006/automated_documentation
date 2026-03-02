const express = require('express');
const router = express.Router();
const {
    logAppActivity,
    getTodayAppActivity,
    getAppActivitySummary
} = require('../controllers/appActivityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, logAppActivity);
router.route('/today').get(protect, getTodayAppActivity);
router.route('/summary').get(protect, getAppActivitySummary);

module.exports = router;
