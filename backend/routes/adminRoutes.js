const express = require('express');
const router = express.Router();
const { registerAdmin, authAdmin, getUsers, getSystemStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', authAdmin);

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getSystemStats);

module.exports = router;
