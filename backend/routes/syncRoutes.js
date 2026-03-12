const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Update the tracker's .env file with the user's current token
 * @route   POST /api/auth/sync-tracker
 * @access  Private
 */
router.post('/sync-tracker', protect, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token found to sync.' });
        }

        const token = authHeader.split(' ')[1];
        const trackerEnvPath = path.join(__dirname, '../../tracker/.env');

        // Read current .env to preserve API_URL
        let envContent = '';
        if (fs.existsSync(trackerEnvPath)) {
            envContent = fs.readFileSync(trackerEnvPath, 'utf8');
        }

        // Parse and update
        const lines = envContent.split('\n');
        let newLines = lines.filter(line => !line.startsWith('JWT_TOKEN='));
        newLines.push(`JWT_TOKEN="${token}"`);

        fs.writeFileSync(trackerEnvPath, newLines.join('\n').trim() + '\n');

        console.log(`[Sync] Tracker token updated for user: ${req.user.email}`);
        res.json({ success: true, message: 'Tracker updated successfully.' });
    } catch (error) {
        console.error('Tracker sync error:', error);
        res.status(500).json({ message: 'Failed to sync tracker token.' });
    }
});

module.exports = router;
