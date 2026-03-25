process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

async function check() {
    try {
        const res = await pool.query('SELECT COUNT(*) FROM users');
        console.log('--- DATABASE STATUS ---');
        console.log('USER_COUNT:', res.rows[0].count);
        process.exit(0);
    } catch (err) {
        console.error('DB ERROR:', err.message);
        process.exit(1);
    }
}
check();
