const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    totalTime: {
        type: Number, // Total duration in seconds for the day
        default: 0,
    },
}, {
    timestamps: true,
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
