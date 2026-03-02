const mongoose = require('mongoose');

const appActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    appName: {
        type: String,
        required: true,
    },
    windowTitle: {
        type: String,
    },
    url: {
        type: String,
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
    }
}, {
    timestamps: true,
});

const AppActivity = mongoose.model('AppActivity', appActivitySchema);

module.exports = AppActivity;
