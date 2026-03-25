const pool = require('../config/db');

// DASHBOARD STATS
exports.getStats = async (req, res) => {
    try {
        // Total Users
        const { rows: userCount } = await pool.query('SELECT COUNT(*) FROM users');
        
        // Active Today (Last active date is today)
        const today = new Date().toISOString().split('T')[0];
        const { rows: activeToday } = await pool.query('SELECT COUNT(*) FROM users WHERE last_active_date = $1', [today]);
        
        // Total Questions
        const { rows: questionCount } = await pool.query('SELECT COUNT(*) FROM questions');
        
        // Total Points Awarded
        const { rows: totalPoints } = await pool.query('SELECT SUM(points) FROM users');

        // Recent Activity (Last 5 answers)
        const { rows: recentActivity } = await pool.query(`
            SELECT ua.*, u.name, q.question 
            FROM user_answers ua 
            JOIN users u ON ua.user_id = u.id 
            JOIN questions q ON ua.question_id = q.id 
            ORDER BY ua.answered_at DESC 
            LIMIT 5
        `);

        // Historical Data (Last 7 days engagement)
        const { rows: history } = await pool.query(`
            SELECT TO_CHAR(answered_at, 'Dy') as name, COUNT(*) as val
            FROM user_answers
            WHERE answered_at > CURRENT_DATE - INTERVAL '7 days'
            GROUP BY TO_CHAR(answered_at, 'Dy'), DATE_TRUNC('day', answered_at)
            ORDER BY DATE_TRUNC('day', answered_at)
        `);

        res.json({
            stats: {
                totalUsers: parseInt(userCount[0].count),
                activeToday: parseInt(activeToday[0].count),
                totalQuestions: parseInt(questionCount[0].count),
                totalPoints: parseInt(totalPoints[0].sum || 0)
            },
            recentActivity,
            history: history.length > 0 ? history : [
                { name: 'Mon', val: 0 }, { name: 'Tue', val: 0 }, { name: 'Wed', val: 0 },
                { name: 'Thu', val: 0 }, { name: 'Fri', val: 0 }, { name: 'Sat', val: 0 }, { name: 'Sun', val: 0 }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// USER MANAGEMENT
exports.getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, email, points, streak, last_active_date, created_at FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { points, streak } = req.body;
        await pool.query('UPDATE users SET points = $1, streak = $2 WHERE id = $3', [points, streak, id]);
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// OFFERS MANAGEMENT
exports.getAllOffers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createOffer = async (req, res) => {
    try {
        const { title, description, cta, link, category } = req.body;
        await pool.query(
            'INSERT INTO offers (title, description, cta, link, category) VALUES ($1, $2, $3, $4, $5)',
            [title, description, cta, link, category]
        );
        res.json({ message: 'Offer created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM offers WHERE id = $1', [id]);
        res.json({ message: 'Offer deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// USER DETAILS & HISTORY
exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Get User Profile
        const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = userRows[0];

        // 2. Get Statistics
        const { rows: quizCount } = await pool.query('SELECT COUNT(*) FROM user_answers WHERE user_id = $1', [id]);
        const { rows: correctCount } = await pool.query('SELECT COUNT(*) FROM user_answers WHERE user_id = $1 AND is_correct = true', [id]);

        // 3. Get History (Last 50 answers)
        const { rows: history } = await pool.query(`
            SELECT ua.*, q.question, q.category
            FROM user_answers ua
            JOIN questions q ON ua.question_id = q.id
            WHERE ua.user_id = $1
            ORDER BY ua.answered_at DESC
            LIMIT 50
        `, [id]);

        res.json({
            profile: user,
            stats: {
                totalQuizzes: parseInt(quizCount[0].count),
                accuracy: quizCount[0].count > 0 ? Math.round((correctCount[0].count / quizCount[0].count) * 100) : 0,
                correct: parseInt(correctCount[0].count)
            },
            history
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- STATIC CONTENT (CMS) ---
exports.getStaticContent = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM static_content ORDER BY title ASC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStaticContent = async (req, res) => {
    try {
        const { key, title, content } = req.body;
        await pool.query(
            'UPDATE static_content SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE key = $3',
            [title, content, key]
        );
        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPublicContent = async (req, res) => {
    try {
        const { key } = req.params;
        const { rows } = await pool.query('SELECT * FROM static_content WHERE key = $1', [key]);
        if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
