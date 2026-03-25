require('dotenv').config({ path: './backend/.env' });
const { Pool } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applyConstraint() {
    try {
        console.log("Applying UNIQUE constraint to user_answers...");
        // This might fail if duplicates exist, so we should clean first if necessary, 
        // but for a new app it should be fine.
        await pool.query('ALTER TABLE user_answers ADD CONSTRAINT unique_user_question UNIQUE (user_id, question_id)');
        console.log("Constraint applied successfully.");
    } catch (err) {
        if (err.code === '42P07') {
            console.log("Constraint already exists.");
        } else {
            console.error("Error applying constraint:", err.message);
        }
    } finally {
        await pool.end();
    }
}

applyConstraint();
