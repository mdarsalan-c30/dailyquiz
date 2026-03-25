require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const sampleQuestions = [
    {
        question: "What does GDP stand for?",
        options: ["Gross Domestic Product", "General Domestic Price", "Gross Deposit Percentage", "General Development Plan"],
        correct_answer: "Gross Domestic Product",
        explanation: "GDP measures the total value of all goods and services produced within a country's borders in a specific period.",
        category: "Economics"
    },
    {
        question: "Which of these is considered a 'safe-haven' asset during market volatility?",
        options: ["Gold", "Bitcoin", "Penny Stocks", "Real Estate Derivatives"],
        correct_answer: "Gold",
        explanation: "Gold has historically maintained its value during economic downturns, making it a classic safe-haven asset.",
        category: "Finance"
    },
    {
        question: "What is an 'IPO'?",
        options: ["Initial Public Offering", "Internal Profit Optimization", "International Price Order", "Interest Premium Option"],
        correct_answer: "Initial Public Offering",
        explanation: "An IPO is the first time a private company offers its shares to the public on a stock exchange.",
        category: "Finance"
    },
    {
        question: "Who is known as the 'Oracle of Omaha'?",
        options: ["Warren Buffett", "Bill Gates", "Elon Musk", "Jeff Bezos"],
        correct_answer: "Warren Buffett",
        explanation: "Warren Buffett, one of the most successful investors ever, is nicknamed the Oracle of Omaha for his investment prowess.",
        category: "Finance"
    },
    {
        question: "What is 'Inflation'?",
        options: ["A general increase in prices", "A decrease in the value of gold", "An increase in purchasing power", "A rise in stock dividends"],
        correct_answer: "A general increase in prices",
        explanation: "Inflation is the rate at which the general level of prices for goods and services is rising.",
        category: "Economics"
    },
    {
        question: "Which central bank issues the US Dollar?",
        options: ["The Federal Reserve", "The US Treasury", "The Bank of America", "The World Bank"],
        correct_answer: "The Federal Reserve",
        explanation: "The Federal Reserve (The Fed) is the central banking system of the United States.",
        category: "Finance"
    },
    {
        question: "What is the primary goal of a 'Bear Market'?",
        options: ["Investors are selling, prices are falling", "Investors are buying, prices are rising", "The market is closed for holidays", "Interest rates are at zero"],
        correct_answer: "Investors are selling, prices are falling",
        explanation: "A bear market is characterized by falling prices and widespread pessimism among investors.",
        category: "Finance"
    },
    {
        question: "What does 'ROI' stand for in business?",
        options: ["Return on Investment", "Rate of Interest", "Risk of Insolvency", "Revenue on Income"],
        correct_answer: "Return on Investment",
        explanation: "ROI is a performance measure used to evaluate the efficiency or profitability of an investment.",
        category: "Finance"
    },
    {
        question: "Which of these is a 'Direct Tax'?",
        options: ["Income Tax", "Sales Tax", "Value Added Tax (VAT)", "Excise Duty"],
        correct_answer: "Income Tax",
        explanation: "Direct taxes are paid directly by the individual or organization to the government.",
        category: "Economics"
    },
    {
        question: "What is 'Compound Interest'?",
        options: ["Interest calculated on principal plus accumulated interest", "Interest calculated only on the initial principal", "A flat fee charged per year", "A penalty for late payments"],
        correct_answer: "Interest calculated on principal plus accumulated interest",
        explanation: "Compound interest is 'interest on interest', making wealth grow faster over time.",
        category: "Finance"
    },
    {
        question: "What is a 'Dividend'?",
        options: ["A portion of company profits paid to shareholders", "A fee paid to a stockbroker", "The interest paid on a bank loan", "The price of a single share"],
        correct_answer: "A portion of company profits paid to shareholders",
        explanation: "Dividends are payments made by a corporation to its shareholders, usually from profits.",
        category: "Finance"
    },
    {
        question: "What is the 'Laissez-faire' economic theory?",
        options: ["Minimal government intervention in the economy", "Heavy government control of all industries", "A system based entirely on bartering", "Directing all profits to social welfare"],
        correct_answer: "Minimal government intervention in the economy",
        explanation: "Laissez-faire is French for 'let do', suggesting that markets work best without government interference.",
        category: "Economics"
    },
    {
        question: "What is the 'Dow Jones Industrial Average'?",
        options: ["A stock market index of 30 large companies", "The total value of all US banks", "The interest rate set by the Fed", "A measure of national unemployment"],
        correct_answer: "A stock market index of 30 large companies",
        explanation: "The DJIA is one of the oldest and most followed stock market indices in the world.",
        category: "Finance"
    },
    {
        question: "What happens when a country has a 'Trade Deficit'?",
        options: ["It imports more than it exports", "It has more than it imports", "Its currency value doubles", "It has no national debt"],
        correct_answer: "It imports more than it exports",
        explanation: "A trade deficit occurs when the cost of a country's imports exceeds the value of its exports.",
        category: "Economics"
    },
    {
        question: "What is a 'Blue Chip' stock?",
        options: ["Stock in a well-established, financially sound company", "A high-risk startup stock", "Stock in a gambling company", "A stock that costs less than $1"],
        correct_answer: "Stock in a well-established, financially sound company",
        explanation: "Blue chip stocks are known for their reliability and ability to operate profitably in good and bad times.",
        category: "Finance"
    },
    {
        question: "What is 'Liquidity'?",
        options: ["How quickly an asset can be converted to cash", "The total amount of cash in a bank's vault", "The profit margin of a beverage company", "A measure of how much a company owes"],
        correct_answer: "How quickly an asset can be converted to cash",
        explanation: "Liquidity describes the degree to which an asset can be quickly bought or sold in the market without affecting its price.",
        category: "Finance"
    },
    {
        question: "What is the 'Opportunity Cost'?",
        options: ["The value of the next best alternative given up", "The total cost of starting a new business", "The interest paid on a credit card", "The discount offered during a sale"],
        correct_answer: "The value of the next best alternative given up",
        explanation: "In economics, opportunity cost is the loss of potential gain from other alternatives when one alternative is chosen.",
        category: "Economics"
    },
    {
        question: "What is 'Fiscal Policy'?",
        options: ["Government spending and taxation to influence the economy", "The regulation of interest rates by central banks", "The rules for international trade agreements", "The management of a company's internal budget"],
        correct_answer: "Government spending and taxation to influence the economy",
        explanation: "Fiscal policy is how a government adjusts its spending levels and tax rates to monitor and influence a nation's economy.",
        category: "Economics"
    },
    {
        question: "What is a 'Bull Market'?",
        options: ["A period of rising stock prices", "A period of falling stock prices", "A market where only agricultural goods are sold", "A market with no regulation"],
        correct_answer: "A period of rising stock prices",
        explanation: "A bull market is a market that is on the rise and where the economy is sound.",
        category: "Finance"
    },
    {
        question: "What is 'Microeconomics'?",
        options: ["The study of individual and business decision making", "The study of the global economy as a whole", "The study of small computer components", "The study of government tax laws only"],
        correct_answer: "The study of individual and business decision making",
        explanation: "Microeconomics focuses on the choices made by individual actors in the economy.",
        category: "Economics"
    }
];

async function seed() {
    console.log("🚀 Starting PostgreSQL Offline Seeding Process...");
    
    const startDate = new Date();
    let generatedCount = 0;

    for (const q of sampleQuestions) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + generatedCount);
        const dateStr = currentDate.toISOString().split('T')[0];

        try {
            await pool.query(
                'INSERT INTO questions (date, question, options, correct_answer, explanation, category) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (date) DO NOTHING',
                [dateStr, q.question, JSON.stringify(q.options), q.correct_answer, q.explanation, q.category]
            );
            generatedCount++;
        } catch (err) {
            console.error("❌ Insert failed:", err);
        }
    }

    console.log(`✨ Seeding Complete! ${generatedCount} questions processed.`);
    await pool.end();
}

seed().catch(console.error);
