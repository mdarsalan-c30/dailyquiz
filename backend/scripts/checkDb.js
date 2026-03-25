require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

pool.query("SELECT date, question FROM questions ORDER BY date LIMIT 10")
    .then(r => {
        r.rows.forEach(row => {
            const d = new Date(row.date).toISOString().split('T')[0];
            console.log(`${d} - ${row.question.substring(0, 50)}`);
        });
        pool.end();
    })
    .catch(e => { console.error(e.message); pool.end(); });
