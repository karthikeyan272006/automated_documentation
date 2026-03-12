const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');

require("dotenv").config();

connectDB();
require('./config/passport'); // Import passport config

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible in controllers
app.set('socketio', io);

app.use(cors());
app.use(express.json());
const passport = require('passport');
app.use(passport.initialize());

// Serve frontend
const __frontendDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(__frontendDir));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Added for Google OAuth consistency
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/app-activity', require('./routes/appActivityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/sync', require('./routes/syncRoutes'));


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__frontendDir, 'index.html'));
});


// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user_activity', (data) => {
        // Broadcast user activity to other connected clients (e.g., admin dashboard)
        socket.broadcast.emit('activity_update', {
            userId: data.userId,
            active: data.active,
            task: data.task,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

