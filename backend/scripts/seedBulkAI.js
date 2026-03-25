require('dotenv').config({ path: './backend/.env' });
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require("@google/generative-ai");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestion(specificDate) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Generate a high-quality, unique finance/economics quiz question for the date ${specificDate}.
            The question should be educational and relevant (focus on: Stock Market, Macro, or Personal Finance).
            Return the result in JSON format with exactly these keys:
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correct_answer": "string (must be one of options)",
              "explanation": "string (max 2 lines)",
              "category": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error(`Error generating for ${specificDate}:`, error.message);
        return null;
    }
}

async function bulkSeed(count) {
    console.log(`🚀 Starting bulk seed of ${count} questions...`);
    const today = new Date();
    let seeded = 0;

    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + 100 + i); // Start from 100 days in future to avoid clashing with current daily ones
        const dateStr = d.toISOString().split('T')[0];

        // Check if exists
        const { rows } = await pool.query("SELECT id FROM questions WHERE date = $1", [dateStr]);
        if (rows.length > 0) {
            console.log(`⏩ Skipping ${dateStr} (already exists)`);
            continue;
        }

        const quiz = await generateQuestion(dateStr);
        if (quiz) {
            await pool.query(
                "INSERT INTO questions (date, question, options, correct_answer, explanation, category) VALUES ($1, $2, $3, $4, $5, $6)",
                [dateStr, quiz.question, JSON.stringify(quiz.options), quiz.correct_answer, quiz.explanation, quiz.category]
            );
            seeded++;
            console.log(`✅ [${seeded}/${count}] Seeded: ${dateStr}`);
        }
        
        // Wait 1s to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n🏁 Finished! Seeded ${seeded} questions.`);
    await pool.end();
}

const count = parseInt(process.argv[2]) || 10;
bulkSeed(count).catch(console.error);
