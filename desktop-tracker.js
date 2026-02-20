const axios = require('axios');
const { exec, spawn } = require('child_process');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const POLL_INTERVAL = 5000; // Check every 5 seconds
const EDITOR_KEYWORDS = ['Visual Studio Code', 'Sublime', 'IntelliJ', 'Atom', 'Notepad++', 'WebStorm', 'Cursor'];

let isTracking = false;
let authToken = ''; // Set this if you want to bypass browser login requirement

console.log('\x1b[36m%s\x1b[0m', '--- AutoDocs All-in-One System ---');
console.log('Starting Backend, Frontend, and Desktop Tracker...');

/**
 * Helper to run processes and pipe output
 */
function startProcess(name, command, cwd) {
    const process = spawn(command, { shell: true, cwd });

    process.stdout.on('data', (data) => {
        console.log(`[\x1b[32m${name}\x1b[0m]: ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[\x1b[31m${name} ERROR\x1b[0m]: ${data.toString().trim()}`);
    });

    return process;
}

// 1. Start Backend
console.log('启动 Backend...');
startProcess('Backend', 'npm run dev', path.join(__dirname, 'backend'));

// 2. Start Frontend
console.log('启动 Frontend...');
startProcess('Frontend', 'npm run dev', path.join(__dirname, 'frontend'));

/**
 * Gets the title of the currently focused window on Windows
 */
function getActiveWindowTitle() {
    return new Promise((resolve) => {
        const cmd = `powershell -command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\"user32.dll\\")] public static extern IntPtr GetForegroundWindow(); }'; $hwnd = [Win32]::GetForegroundWindow(); Get-Process | Where-Object { $_.MainWindowHandle -eq $hwnd } | Select-Object -ExpandProperty MainWindowTitle"`;

        exec(cmd, (err, stdout) => {
            if (err) return resolve('');
            resolve(stdout.trim());
        });
    });
}

/**
 * Sync activity with backend
 */
async function syncActivity() {
    try {
        const windowTitle = await getActiveWindowTitle();
        const isEditorActive = EDITOR_KEYWORDS.some(k => windowTitle.includes(k));

        if (isEditorActive && !isTracking) {
            console.log('\x1b[35m%s\x1b[0m', `🚀 Editor Detected: ${windowTitle}. Starting timer...`);
            // In a fully automated setup, the user would login via browser first.
            // This script tracks intent. If authToken is provided, it pings the API.
            isTracking = true;
        } else if (!isEditorActive && isTracking) {
            console.log('\x1b[33m%s\x1b[0m', '⏸️ Switching to non-work app. Pausing timer...');
            isTracking = false;
        }
    } catch (error) {
        // Silently handle startup errors before backend is ready
    }
}

// Wait a bit before starting the monitor to let the backend boot
setTimeout(() => {
    console.log('\x1b[34m%s\x1b[0m', 'Monitor active. Happy coding!');
    setInterval(syncActivity, POLL_INTERVAL);
}, 10000);
