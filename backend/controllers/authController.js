const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

const crypto = require('crypto');

exports.register = async (req, res) => {
    try {
        const { email, password, name, referredBy } = req.body;

        // Check if user exists
        const { rows: existing } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Generate Unique Referral Code
        const referralCode = 'QWIZO_' + crypto.randomBytes(3).toString('hex').toUpperCase();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Process referral logic if referredBy exists
        let referredById = null;
        if (referredBy) {
            const { rows: referrer } = await pool.query('SELECT id FROM users WHERE referral_code = $1', [referredBy]);
            if (referrer.length > 0) {
                referredById = referrer[0].id;
                // Award 10 points to referrer
                await pool.query('UPDATE users SET points = points + 10 WHERE id = $1', [referredById]);
            }
        }

        // Insert user
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, name, last_active_date, referral_code, referred_by_id) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5) RETURNING id',
            [email, hashedPassword, name, referralCode, referredById]
        );

        res.status(201).json({ message: 'User registered successfully', userId: rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' }); // Extended to 30d

        // Update last active
        await pool.query('UPDATE users SET last_active_date = CURRENT_DATE WHERE id = $1', [user.id]);

        // Auto-generate referral code if user doesn't have one (legacy users)
        let referralCode = user.referral_code;
        if (!referralCode) {
            referralCode = 'QWIZO_' + crypto.randomBytes(3).toString('hex').toUpperCase();
            await pool.query('UPDATE users SET referral_code = $1 WHERE id = $2', [referralCode, user.id]);
        }

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                streak: user.streak,
                points: user.points,
                referral_code: referralCode
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const { rows } = await pool.query('SELECT streak, points, last_active_date, name FROM users WHERE id = $1', [userId]);

        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
