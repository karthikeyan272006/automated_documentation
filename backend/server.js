const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const path = require('path');
const { default: mongoose } = require('mongoose');

dotenv.config({ path: path.join(__dirname, '.env') });
mongoose.connect("mongodb://127.0.0.1:27017/automated-docs")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// model
const User = mongoose.model("User", UserSchema)

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "register.jsx"));
})
app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
    try {
        console.log(req.body); // debug

        const { name, email, password } = req.body;

        const newUser = new User({ name, email, password });

        await newUser.save();

        res.json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// LOGIN API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
        res.json({ message: "Login successful" });
    } else {
        res.json({ message: "Invalid email or password" });
    }
});

// Make io accessible in controllers
app.set('socketio', io);



app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

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

