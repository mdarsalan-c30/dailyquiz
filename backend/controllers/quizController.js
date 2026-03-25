const pool = require('../config/db');
const quizGenerator = require('../services/quizGenerator');

exports.getTodayQuiz = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        let quizRow = null;

        // 1. Try today's exact date
        const { rows } = await pool.query('SELECT * FROM questions WHERE date = $1', [today]);
        
        if (rows.length > 0) {
            quizRow = rows[0];
        } else {
            // 2. Try generation
            const quiz = await quizGenerator.generateDailyQuiz();
            if (quiz) {
                const { rows: newRows } = await pool.query('SELECT * FROM questions WHERE date = $1', [today]);
                if (newRows.length > 0) quizRow = newRows[0];
            }
        }

        // 3. Robust Fallback: Get the most recent question before or on today
        if (!quizRow) {
            const { rows: fallbackRows } = await pool.query('SELECT * FROM questions WHERE date <= $1 ORDER BY date DESC LIMIT 1', [today]);
            if (fallbackRows.length > 0) quizRow = fallbackRows[0];
        }

        // 4. Absolute Fallback: Get any latest question
        if (!quizRow) {
            const { rows: ultimateRows } = await pool.query('SELECT * FROM questions ORDER BY date DESC LIMIT 1');
            if (ultimateRows.length > 0) quizRow = ultimateRows[0];
        }

        if (!quizRow) {
            return res.status(404).json({ message: 'No quiz found in the database.' });
        }

        // Don't send the correct answer to the client in the first request
        const { correct_answer, ...clientQuiz } = quizRow;
        res.json(clientQuiz);
    } catch (error) {
        console.error('getTodayQuiz Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { question_id, selected_answer, userId } = req.body;
        if (!userId) return res.status(401).json({ message: 'User ID required' });

        // 1. Check if already answered
        const { rows: existing } = await pool.query(
            'SELECT id FROM user_answers WHERE user_id = $1 AND question_id = $2',
            [userId, question_id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already answered this question today.' });
        }
        
        // 2. Get correct answer from DB
        const { rows: qRows } = await pool.query('SELECT correct_answer, explanation FROM questions WHERE id = $1', [question_id]);
        if (qRows.length === 0) return res.status(404).json({ message: 'Question not found' });

        const { correct_answer, explanation } = qRows[0];
        const is_correct = selected_answer === correct_answer;

        // 3. Save answer
        await pool.query(
            'INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct) VALUES ($1, $2, $3, $4)',
            [userId, question_id, selected_answer, is_correct]
        );

        // 4. Update user points & streak
        let pointsEarned = 0;
        if (is_correct) {
            pointsEarned = 10;
            
            // Get current streak and last active date
            const { rows: uRows } = await pool.query('SELECT streak, last_active_date FROM users WHERE id = $1', [userId]);
            const user = uRows[0];
            
            const today = new Date().toISOString().split('T')[0];
            const lastDate = user.last_active_date ? user.last_active_date.toISOString().split('T')[0] : null;
            
            let newStreak = user.streak || 0;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                newStreak += 1;
            } else if (lastDate !== today) {
                newStreak = 1;
            }

            await pool.query(
                'UPDATE users SET points = points + $1, streak = $2, last_active_date = $3 WHERE id = $4',
                [pointsEarned, newStreak, today, userId]
            );
        }

        res.json({
            is_correct,
            explanation,
            correct_answer,
            points_earned: pointsEarned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getQuizHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const { rows } = await pool.query(
            `SELECT ua.*, q.question, q.category, q.date 
             FROM user_answers ua 
             JOIN questions q ON ua.question_id = q.id 
             WHERE ua.user_id = $1 
             ORDER BY ua.answered_at DESC`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.bulkSeedQuestions = async (req, res) => {
    try {
        const { count = 10, secret } = req.query;
        // Hardcoded secret for one-time seeding to avoid environment variable issues
        if (secret !== 'DAILYQ_BULK_SEED_2026') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        console.log(`Starting cloud-side bulk seed: ${count} questions`);
        
        let seeded = 0;
        const today = new Date();

        for (let i = 0; i < parseInt(count); i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];

            // Check if exists
            const { rows } = await pool.query("SELECT id FROM questions WHERE date = $1", [dateStr]);
            if (rows.length > 0) continue;

            const quiz = await quizGenerator.generateDailyQuizCustom(dateStr);
            if (quiz) seeded++;
            
            // Wait slightly to avoid rate limits
            await new Promise(r => setTimeout(r, 1000));
        }

        res.json({ message: `Seeded ${seeded} questions starting from ${today.toISOString().split('T')[0]}` });
    } catch (error) {
        console.error("Bulk Seed Error:", error);
        res.status(500).json({ message: 'Partial failure during seed' });
    }
};

exports.getRandomQuestions = async (req, res) => {
    try {
        const limit = parseInt(req.query.count) || 10;
        const { rows } = await pool.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT $1', [limit]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No questions available.' });
        }

        const clientQuizzes = rows.map(q => {
            const { correct_answer, ...cleanQ } = q;
            return cleanQ;
        });

        res.json(clientQuizzes);
    } catch (error) {
        console.error('getRandomQuestions Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.submitInfiniteAnswer = async (req, res) => {
    try {
        const { question_id, selected_answer, userId } = req.body;
        if (!userId) return res.status(401).json({ message: 'User ID required' });

        const { rows: questionRows } = await pool.query('SELECT correct_answer FROM questions WHERE id = $1', [question_id]);
        if (questionRows.length === 0) return res.status(404).json({ message: 'Question not found' });

        const isCorrect = (questionRows[0].correct_answer === selected_answer);

        await pool.query('BEGIN');
        
        // Log answer if it hasn't been answered before in history
        const insertRes = await pool.query(
            'INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, question_id) DO NOTHING RETURNING id',
            [userId, question_id, selected_answer, isCorrect]
        );

        // Award points and update streak if correct and first time answering
        if (insertRes.rowCount > 0 && isCorrect) {
            // Get current streak and last active date
            const { rows: uRows } = await pool.query('SELECT streak, last_active_date FROM users WHERE id = $1', [userId]);
            const user = uRows[0];

            const today = new Date().toISOString().split('T')[0];
            const lastDate = user.last_active_date ? user.last_active_date.toISOString().split('T')[0] : null;

            let newStreak = user.streak || 0;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
                newStreak += 1;
            } else if (lastDate !== today) {
                newStreak = 1;
            }

            await pool.query(
                'UPDATE users SET points = points + 10, streak = $1, last_active_date = $2 WHERE id = $3',
                [newStreak, today, userId]
            );
        }

        await pool.query('COMMIT');

        res.json({
            is_correct: isCorrect,
            correct_answer: questionRows[0].correct_answer
        });
    } catch (error) {
         await pool.query('ROLLBACK');
         console.error('submitInfiniteAnswer Error:', error);
         res.status(500).json({ message: 'Server error' });
    }
};
