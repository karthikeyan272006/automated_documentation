const axios = require('axios');
const activeWin = require('active-win');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = process.env.API_URL || 'http://localhost:5000/api/app-activity';
const JWT_TOKEN = process.env.JWT_TOKEN;
const POLL_INTERVAL = 5000; // 5 seconds
const envPath = path.join(__dirname, '.env');

function getLatestToken() {
    try {
        const envContent = require('fs').readFileSync(envPath, 'utf8');
        const match = envContent.match(/JWT_TOKEN=["']?([^"'\n\r]+)["']?/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

let currentSession = null;

async function getActiveAppDetails() {
    try {
        const result = await activeWin();
        if (!result) return null;

        return {
            appName: result.owner.name,
            windowTitle: result.title,
            url: result.url || null,
            startTime: new Date()
        };
    } catch (error) {
        console.error('Error getting active window:', error.message);
        return null;
    }
}

async function sendSessionToBackend(session) {
    const token = getLatestToken();
    if (!token || token === 'REPLACE_WITH_YOUR_TOKEN_FROM_BROWSER') {
        console.error('JWT_TOKEN is missing or not synced from browser yet. Cannot sync activity.');
        return;
    }

    try {
        const endTime = new Date();
        const payload = {
            ...session,
            endTime
        };

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`Synced: ${session.appName} | Duration: ${Math.floor((endTime - session.startTime) / 1000)}s`);
    } catch (error) {
        console.error('Error syncing with backend:', error.response?.data?.message || error.message);
    }
}

async function track() {
    const details = await getActiveAppDetails();

    if (!details) return;

    if (!currentSession) {
        // Start first session
        console.log(`Initial Session: ${details.appName}`);
        currentSession = details;
    } else if (currentSession.appName !== details.appName || (details.url && currentSession.url !== details.url)) {
        // App or URL changed, save old session and start new one
        console.log(`Switching: ${currentSession.appName} -> ${details.appName}`);
        await sendSessionToBackend(currentSession);
        currentSession = details;
    } else {
        // Same app, keep going (duration will be calculated on sync)
        currentSession.windowTitle = details.windowTitle;
    }
}

console.log('--- App Activity Tracker Started ---');
console.log(`Tracking every ${POLL_INTERVAL / 1000}s...`);

setInterval(track, POLL_INTERVAL);

// Handle process exit to save final session
process.on('SIGINT', async () => {
    if (currentSession) {
        console.log('\nFinalizing last session...');
        await sendSessionToBackend(currentSession);
    }
    process.exit();
});
