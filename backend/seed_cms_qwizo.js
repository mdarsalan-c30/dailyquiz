const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Note: Ensure your .env is loaded or manually provide connection string for production
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

const cmsContent = [
    {
        key: 'about-us',
        title: 'About QWIZO',
        content: `QWIZO is India's premier niche quiz platform dedicated to Insurance Education. 

Our mission is to simplify complex insurance concepts for Bike, Car, and Health Insurance through engaging and rewarding daily quizzes. Whether you are looking to understand your policy better or earn rewards while learning, QWIZO is your go-to companion.

With QWIZO, you get:
- Daily Curated Quizzes on Insurance Trends
- Educational Insights on Policy Selection
- Viral Referral Rewards (Invite & Earn)
- Real-time Leaderboards

Join thousands of users who are thinking better and insuring smarter with QWIZO.`
    },
    {
        key: 'privacy-policy',
        title: 'Privacy Policy',
        content: `At QWIZO, we value your privacy. We collect minimal data including your name, email, and quiz performance to provide a personalized experience.

Specifically for our Insurance niche:
- We do NOT sell your data to third-party insurance brokers without explicit consent.
- Your quiz patterns are used solely to improve our AI-generated educational content.
- Referral data is encrypted and used only for bonus point allocation.

By using QWIZO, you consent to our secure data handling practices designed for the highest level of user trust.`
    },
    {
        key: 'terms-conditions',
        title: 'Terms & Conditions',
        content: `Welcome to QWIZO. By accessing our platform, you agree to:
1. Provide accurate information during registration.
2. Use the platform for educational purposes only.
3. Not abuse the 'Invite & Earn' system via self-referrals or bots.

Disclaimer: QWIZO provides educational content and is NOT a licensed insurance advisor. Quiz results do not constitute financial advice. Always consult with a certified insurance professional for policy decisions.`
    }
];

async function seedCMS() {
    console.log('🌱 Seeding QWIZO CMS Content...');
    try {
        for (const item of cmsContent) {
            await pool.query(
                'INSERT INTO static_content (key, title, content) VALUES ($1, $2, $3) ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP',
                [item.key, item.title, item.content]
            );
            console.log(`✅ Seeded: ${item.key}`);
        }
        console.log('🚀 QWIZO CMS Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedCMS();
