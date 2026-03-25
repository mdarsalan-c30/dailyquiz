require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Global Request Logger for Troubleshooting
app.use((req, res, next) => {
    console.log(`>>> [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const offersRoutes = require('./routes/offersRoutes');

// Basic Health Checks
app.get('/', (req, res) => res.send('DailyQ API is active.'));
app.get('/api/test', (req, res) => res.json({ status: 'Online', time: new Date() }));

// Register Logic Groups
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/offers', offersRoutes);

// Detailed 404 Handler
app.use((req, res) => {
    console.error(`!!! [404] Route Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'Not Found', 
        message: `The path ${req.url} does not exist on this server.`,
        availableGroups: ['/api/auth', '/api/quiz', '/api/admin', '/api/leaderboard', '/api/offers']
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('=========================================');
    console.log(`🚀 DAILYQ BACKEND RUNNING ON PORT ${PORT}`);
    console.log(`🔗 BASE URL: http://127.0.0.1:${PORT}`);
    console.log('=========================================');
});
