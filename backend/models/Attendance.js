const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    loginTime: {
        type: Date,
        required: true,
    },
    logoutTime: {
        type: Date,
    },
    workHours: {
        type: String, // Format: "HH:mm" or just hours as number? User said "calculated". I'll use Number for hours.
        default: "0",
    },
    status: {
        type: String,
        enum: ['Present', 'Late'],
        default: 'Present',
    },
}, {
    timestamps: true,
});

// Ensure a user can only have one attendance record per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
