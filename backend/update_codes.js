const { Pool } = require('pg');
const crypto = require('crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

async function run() {
    try {
        const { rows } = await pool.query('SELECT id FROM users WHERE referral_code IS NULL');
        console.log(`Updating ${rows.length} users with referral codes...`);
        
        for (const user of rows) {
            const code = 'QWIZO_' + crypto.randomBytes(3).toString('hex').toUpperCase();
            await pool.query('UPDATE users SET referral_code = $1 WHERE id = $2', [code, user.id]);
        }
        
        console.log('✅ All users updated.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
