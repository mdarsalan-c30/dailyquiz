const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

const sql = `
CREATE TABLE IF NOT EXISTS static_content (
    key VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO static_content (key, title, content) VALUES 
('privacy-policy', 'Privacy Policy', 'This Privacy Policy explains how DailyQ collects and uses your data. We take your privacy seriously.'),
('terms-conditions', 'Terms & Conditions', 'Welcome to DailyQ. By using our app, you agree to these terms.'),
('help-support', 'Help & Support', 'If you need any assistance, please contact us at support@dailyq.com. We are here to help!')
ON CONFLICT (key) DO NOTHING;
`;

pool.query(sql)
    .then(() => {
        console.log('✅ CMS System Initialized Successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error initializing CMS:', err);
        process.exit(1);
    });
