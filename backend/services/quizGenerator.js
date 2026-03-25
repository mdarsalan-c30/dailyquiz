const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../config/db");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateDailyQuiz = async () => {
    const today = new Date().toISOString().split('T')[0];
    return this.generateDailyQuizCustom(today);
};

exports.generateDailyQuizCustom = async (specificDate) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Generate an elite, unique quiz question about Insurance for the date ${specificDate}.
            Focus MUST be one of: [Bike Insurance, Car Insurance, Health Insurance].
            The question should be practical and educational (e.g., about premiums, claims, coverage, or policy terms).
            This is for an SEO-optimized insurance educational app.
            
            Return ONLY a valid JSON object with exactly these keys:
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correct_answer": "string (must be one of options)",
              "explanation": "string (clear and informative)",
              "category": "string (Insurance Type)"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Failed to parse JSON from Gemini");
        
        const quiz = JSON.parse(jsonMatch[0]);

        // Insert into DB using PostgreSQL syntax
        await pool.query(
            "INSERT INTO questions (date, question, options, correct_answer, explanation, category) VALUES ($1, $2, $3, $4, $5, $6)",
            [specificDate, quiz.question, JSON.stringify(quiz.options), quiz.correct_answer, quiz.explanation, quiz.category]
        );

        console.log(`Generated and saved quiz for ${specificDate}`);
        return quiz;
    } catch (error) {
        console.error(`Error generating quiz for ${specificDate}:`, error);
        return null;
    }
};
