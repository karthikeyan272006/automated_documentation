const mongoose = require('mongoose');

const payrollSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    totalHours: {
        type: Number,
        required: true,
    },
    hourlyRate: {
        type: Number,
        required: true,
    },
    grossPay: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    netPay: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending',
    },
    paymentDate: {
        type: Date,
    },
    transactionId: {
        type: String,
    }
}, {
    timestamps: true,
});

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
