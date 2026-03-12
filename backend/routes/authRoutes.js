const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authUser, registerUser, getUserProfile, logoutUser, generateToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);
router.get("/me", protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.fullname || req.user.name,
    email: req.user.email,
  });
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/', session: false }),
    (req, res) => {
        // Successful authentication, redirect to frontend with token
        const token = generateToken(req.user._id);
        res.redirect(`http://localhost:5173/google-success?token=${token}`);
    }
);

module.exports = router;

