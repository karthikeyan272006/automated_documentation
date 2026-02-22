const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    loginTime: {
        type: Date,
    },
    logoutTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'on_leave'],
        default: 'present',
    },
    workHours: {
        type: Number, // in seconds
        default: 0,
    },
    overtime: {
        type: Number, // in seconds
        default: 0,
    }
}, {
    timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
