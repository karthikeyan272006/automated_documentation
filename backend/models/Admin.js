const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    },
}, {
    timestamps: true,
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
    console.log(`Comparing admin passwords for: ${this.email}`);
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log(`Admin password match result: ${isMatch}`);
    return isMatch;
};

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Admin", adminSchema);
