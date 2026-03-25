require('dotenv').config({ path: './backend/.env' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkRows() {
    try {
        console.log("Checking DB connection...");
        const res = await pool.query('SELECT COUNT(*) FROM questions');
        console.log("Total questions in DB:", res.rows[0].count);
        
        const res2 = await pool.query('SELECT COUNT(*) FROM users');
        console.log("Total users in DB:", res2.rows[0].count);
        
        const res3 = await pool.query('SELECT COUNT(*) FROM user_answers');
        console.log("Total answers in DB:", res3.rows[0].count);
    } catch (err) {
        console.error("Error Details:", err);
    } finally {
        await pool.end();
    }
}

checkRows();
