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
        enum: ['coding', 'meeting', 'designing', 'debugging', 'testing', 'documentation', 'learning', 'other'],
        default: 'coding',
    },
    description: {
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
