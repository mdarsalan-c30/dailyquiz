const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

const sql = `
INSERT INTO static_content (key, title, content) VALUES 
('about-us', 'About QWIZO', 'Welcome to QWIZO, your premium destination for intellectual challenges and daily quiz fun! We believe learning should be rewarding, which is why we offer a seamless, gamified experience with real-time leaderboards and referral bonuses. Challenge your friends today!')
ON CONFLICT (key) DO NOTHING;
`;

pool.query(sql)
    .then(() => {
        console.log('✅ About-Us Content Seeded Successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error seeding about-us:', err);
        process.exit(1);
    });
