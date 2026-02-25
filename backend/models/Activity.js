const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    activityType: {
        type: String,
        required: true,
        enum: ['coding', 'meeting', 'designing', 'debugging', 'testing', 'documentation', 'learning', 'browsing', 'other'],
        default: 'coding',
    },
    appName: {
        type: String,
    },
    url: {
        type: String,
    },
    description: {
        type: String,
    },
    screenshot: {
        type: String, // Path to screenshot
    },
    activityLevel: {
        type: Number, // 0-100 percentage
        default: 0,
    },
    keyboardCount: {
        type: Number,
        default: 0,
    },
    mouseCount: {
        type: Number,
        default: 0,
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String,
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number, // duration in seconds
        default: 0,
    },
    status: {
        type: String,
        enum: ['Running', 'Paused', 'Stopped'],
        default: 'Running',
    },
    pausedAt: {
        type: Date,
    },
    totalPausedTime: {
        type: Number, // in seconds
        default: 0,
    },
    isManual: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

