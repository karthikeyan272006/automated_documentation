const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
    },
    summaryText: {
        type: String,
        required: true,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
