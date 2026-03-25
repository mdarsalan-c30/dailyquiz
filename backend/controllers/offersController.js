const pool = require('../config/db');

exports.getOffers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM offers');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
