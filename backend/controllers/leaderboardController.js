const pool = require('../config/db');

exports.getLeaderboard = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT name, points FROM users ORDER BY points DESC LIMIT 50'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
