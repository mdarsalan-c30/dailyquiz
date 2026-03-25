const { Pool } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

const insuranceQuestions = [
    {
        question: "What does 'IDV' stand for in car insurance?",
        options: ["Insured Declared Value", "Internal Driving Value", "Insurance Discount Voucher", "Initial Damage Valuation"],
        correct_answer: "Insured Declared Value",
        explanation: "IDV is the maximum sum assured by the insurer in case of total loss or theft of the vehicle.",
        category: "Car Insurance"
    },
    {
        question: "Which insurance is mandatory for all vehicles in India?",
        options: ["First Party Insurance", "Zero Depreciation", "Third Party Insurance", "Comprehensive Insurance"],
        correct_answer: "Third Party Insurance",
        explanation: "Third-party insurance is legally mandatory under the Motor Vehicles Act to cover damages to others.",
        category: "Bike Insurance"
    },
    {
        question: "What is 'No Claim Bonus' (NCB)?",
        options: ["A fine for constant claims", "A reward for not making any claims during the policy year", "Insurance specifically for new cars", "A government tax on insurance"],
        correct_answer: "A reward for not making any claims during the policy year",
        explanation: "NCB is a discount on the premium for the next year if no claim was made in the current year.",
        category: "Car Insurance"
    },
    {
        question: "In Health Insurance, what is 'Waiting Period'?",
        options: ["Time spent in the hospital", "Time before a policy expires", "Duration during which certain diseases are not covered", "Time to get a refund"],
        correct_answer: "Duration during which certain diseases are not covered",
        explanation: "Most health plans have a waiting period (e.g., 2-4 years) for pre-existing diseases.",
        category: "Health Insurance"
    },
    {
        question: "What is 'Zero Depreciation' cover?",
        options: ["Policy with 0% premium", "Insurance where depreciation of parts is not deducted during claims", "Life insurance for old people", "Policy for cheap bikes only"],
        correct_answer: "Insurance where depreciation of parts is not deducted during claims",
        explanation: "With Zero Dep, you get the full claim amount for replaced parts without considering their age.",
        category: "Car Insurance"
    }
];

async function seed() {
    try {
        console.log("Seeding premium Insurance questions...");
        for (const q of insuranceQuestions) {
            await pool.query(
                "INSERT INTO questions (question, options, correct_answer, explanation, category, date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE + interval '1 day') ON CONFLICT DO NOTHING",
                [q.question, JSON.stringify(q.options), q.correct_answer, q.explanation, q.category]
            );
        }
        console.log("✅ Insurance seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
