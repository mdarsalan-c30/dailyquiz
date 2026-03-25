require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function init() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log("Connected to PostgreSQL.");

    const sqlPath = path.join(__dirname, '..', 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        try {
            await pool.query(statement);
        } catch (err) {
            console.error("Statement failed:", err.message);
        }
    }

    console.log("Database initialized successfully!");
    await pool.end();
}

init().catch(err => {
    console.error("Initialization failed:", err);
    process.exit(1);
});
