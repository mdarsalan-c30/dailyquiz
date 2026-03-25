require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const questions = [
    { q: "What is the full form of KYC in banking?", opts: ["Know Your Customer", "Keep Your Cash", "Knowing Yield Currency", "Key Yearly Credit"], ans: "Know Your Customer", exp: "KYC is a mandatory process for banks to verify the identity of their clients.", cat: "Banking" },
    { q: "Which organization regulates the insurance sector in India?", opts: ["RBI", "SEBI", "IRDAI", "PFRDA"], ans: "IRDAI", exp: "Insurance Regulatory and Development Authority of India (IRDAI) oversees the insurance industry.", cat: "Insurance" },
    { q: "What does 'Premium' refer to in insurance?", opts: ["The highest coverage policy", "Amount paid periodically to keep a policy active", "Bonus received on maturity", "The agent's commission"], ans: "Amount paid periodically to keep a policy active", exp: "A premium is the cost of insurance paid regularly to the insurer.", cat: "Insurance" },
    { q: "What is an 'Overdraft' facility?", opts: ["A penalty for late payment", "Allowing a customer to withdraw more money than the account balance", "A type of long-term loan", "Bonus interest paid by bank"], ans: "Allowing a customer to withdraw more money than the account balance", exp: "An overdraft allows withdrawal up to a certain limit even when the account balance is zero.", cat: "Banking" },
    { q: "Which type of life insurance provides coverage for a specific period only?", opts: ["Endowment Policy", "Term Insurance", "Whole Life Insurance", "ULIP"], ans: "Term Insurance", exp: "Term insurance offers protection for a specified period (term) and pays out only if death occurs during this term.", cat: "Insurance" },
    { q: "What is 'NEFT' in Indian banking?", opts: ["National Electronic Funds Transfer", "Net Estimated Financial Transaction", "New Economy Fund Transfer", "National Enquiry for Trade"], ans: "National Electronic Funds Transfer", exp: "NEFT is an electronic funds transfer system maintained by the Reserve Bank of India.", cat: "Banking" },
    { q: "What does 'NPA' stand for in the banking sector?", opts: ["Net Personal Assets", "Non-Performing Assets", "New Policy Approval", "National Payment Authority"], ans: "Non-Performing Assets", exp: "NPA refers to loans or advances that are in default or in arrears.", cat: "Banking" },
    { q: "In insurance, what is a 'Deductible'?", opts: ["Tax deducted from the payout", "The amount the insured pays out-of-pocket before insurance covers the rest", "A discount on premium", "Cancellation fee"], ans: "The amount the insured pays out-of-pocket before insurance covers the rest", exp: "It is the initial amount of a claim that the policyholder must pay before the insurer pays.", cat: "Insurance" },
    { q: "What is the primary function of a 'Rider' in an insurance policy?", opts: ["To cancel the policy", "To add extra benefits/coverage to the base policy", "To reduce the premium amount", "To change the beneficiary"], ans: "To add extra benefits/coverage to the base policy", exp: "Riders are optional add-ons that provide additional benefits like critical illness cover.", cat: "Insurance" },
    { q: "What is 'RTGS' used for?", opts: ["Small scale daily transfers", "Real-time Gross Settlement for high-value transactions", "Opening a new bank account", "International stock trading"], ans: "Real-time Gross Settlement for high-value transactions", exp: "RTGS is a continuous and real-time settlement of fund transfers, used primarily for high-value transactions.", cat: "Banking" },
    { q: "What does 'Surrender Value' mean in life insurance?", opts: ["The amount paid by insurer if the policyholder cancels before maturity", "The death benefit", "The total premium paid", "The agent's commission"], ans: "The amount paid by insurer if the policyholder cancels before maturity", exp: "It is the sum of money an insurance company pays to the policyholder in the event of voluntary termination.", cat: "Insurance" },
    { q: "What is 'Core Banking Solution' (CBS)?", opts: ["A software connecting all branches of a bank", "A new type of ATM card", "A central bank regulation", "A locker facility"], ans: "A software connecting all branches of a bank", exp: "CBS enables customers to operate their accounts from any branch of the bank.", cat: "Banking" },
    { q: "What is 'Bancassurance'?", opts: ["Banks providing insurance against theft", "Selling of insurance products by banks", "Insurance for bankrupt companies", "A type of loan insurance"], ans: "Selling of insurance products by banks", exp: "It is an arrangement between a bank and an insurance company allowing the insurance company to sell its products to the bank's client base.", cat: "Banking & Insurance" },
    { q: "Which principle of insurance means 'utmost good faith'?", opts: ["Principle of Indemnity", "Principle of Subrogation", "Uberrimae Fides", "Principle of Contribution"], ans: "Uberrimae Fides", exp: "It means that both the insurer and the insured must disclose all material facts correctly.", cat: "Insurance" },
    { q: "What is 'MCLR' in banking terminology?", opts: ["Marginal Cost of Funds based Lending Rate", "Maximum Credit Limit Regulation", "Minimum Cash Liquidity Ratio", "Monetary Cost and Lending Risk"], ans: "Marginal Cost of Funds based Lending Rate", exp: "MCLR is the minimum interest rate below which banks cannot lend.", cat: "Banking" },
    { q: "What is a 'Grace Period' in insurance?", opts: ["Time granted after the due date to pay the premium without losing coverage", "The waiting period before making a claim", "The time to cancel a policy for free", "The duration of the policy term"], ans: "Time granted after the due date to pay the premium without losing coverage", exp: "It usually lasts 15-30 days after the premium due date.", cat: "Insurance" },
    { q: "What is the function of the 'Ombudsman' in banking and insurance?", opts: ["To sell policies", "To resolve customer complaints and grievances", "To audit the banks", "To set interest rates"], ans: "To resolve customer complaints and grievances", exp: "An ombudsman is an official appointed to investigate individuals' complaints against maladministration.", cat: "Banking & Insurance" },
    { q: "What is 'Subrogation' in insurance?", opts: ["Transferring the claim rights to the insurer after they pay the claim", "Submitting a fake claim", "Upgrading a policy", "Paying premiums in advance"], ans: "Transferring the claim rights to the insurer after they pay the claim", exp: "It allows the insurer to pursue a third party that caused the insurance loss.", cat: "Insurance" },
    { q: "What does 'IFSC' stand for in banking?", opts: ["Indian Financial System Code", "International Fund Settlement Center", "Inter-bank Financial Swift Code", "Indian Foreign Security Code"], ans: "Indian Financial System Code", exp: "IFSC is an 11-character alphanumeric code used to identify bank branches in electrical fund transfer.", cat: "Banking" },
    { q: "What is 'Insured Declared Value' (IDV) in motor insurance?", opts: ["The cost of a new vehicle", "The maximum amount the insurer will pay if the vehicle is perfectly stolen/destroyed", "The premium amount", "The third-party liability limit"], ans: "The maximum amount the insurer will pay if the vehicle is perfectly stolen/destroyed", exp: "IDV is essentially the current market value of your vehicle.", cat: "Insurance" },
    { q: "What is an 'Endowment Policy'?", opts: ["Pure risk cover", "Combines life cover with a savings component", "Only for vehicle insurance", "A type of health insurance"], ans: "Combines life cover with a savings component", exp: "It pays out a lump sum on maturity or on death.", cat: "Insurance" },
    { q: "In banking, what is an 'NRO Account'?", opts: ["Non-Resident Ordinary account for NRIs to manage income earned in India", "A locker account", "A loan account for students", "No Risk Organization account"], ans: "Non-Resident Ordinary account for NRIs to manage income earned in India", exp: "NRO accounts are used to manage income like rent, dividends, etc., earned in India by NRIs.", cat: "Banking" },
    { q: "What does 'Claim Settlement Ratio' (CSR) indicate?", opts: ["Number of claims rejected", "Percentage of claims settled by an insurer out of total claims received", "The speed of settlement", "The commission paid to agents"], ans: "Percentage of claims settled by an insurer out of total claims received", exp: "A higher CSR indicates a higher likelihood of your claim being approved.", cat: "Insurance" },
    { q: "What is 'Re-insurance'?", opts: ["When a client buys multiple policies", "When an insurance company buys insurance to protect itself from major losses", "Renewing an expired policy", "Switching insurers"], ans: "When an insurance company buys insurance to protect itself from major losses", exp: "Reinsurance transferred portions of risk portfolios to other parties.", cat: "Insurance" },
    { q: "What is 'CIBIL' known for?", opts: ["Issuing currency", "Credit scoring and reporting for individuals and businesses", "Stock exchange regulation", "Selling health insurance"], ans: "Credit scoring and reporting for individuals and businesses", exp: "CIBIL maintains records of individuals' payments pertaining to loans and credit cards.", cat: "Banking" },
    { q: "What does 'Maturity Benefit' mean in life insurance?", opts: ["Amount paid if the insured survives the policy term", "Amount paid on death", "A bonus given randomly", "Refund of first premium"], ans: "Amount paid if the insured survives the policy term", exp: "It is the lump sum amount received at the end of the policy tenure.", cat: "Insurance" },
    { q: "What is 'SWIFT' used for?", opts: ["Domestic ATM transactions", "International wire transfers and messaging between banks", "Stock trading in India", "Paying health insurance premiums"], ans: "International wire transfers and messaging between banks", exp: "SWIFT provides a network that enables financial institutions worldwide to send and receive information about financial transactions securely.", cat: "Banking" },
    { q: "What is the 'Principle of Indemnity'?", opts: ["Insured should not profit from a loss; they should just be restored to their previous financial position", "Insurer guarantees a profit", "Life insurance pays double", "All claims are rejected"], ans: "Insured should not profit from a loss; they should just be restored to their previous financial position", exp: "This principle applies to properties and means you cannot make a profit from an insurance claim.", cat: "Insurance" },
    { q: "What is a 'Cheque Bounce'?", opts: ["A folded cheque", "When a bank returns a cheque unpaid due to insufficient funds", "Cashing a cheque instantly", "A post-dated cheque"], ans: "When a bank returns a cheque unpaid due to insufficient funds", exp: "Also known as dishonor of cheque, usually due to lack of funds in the drawer's account.", cat: "Banking" },
    { q: "What is 'No Claim Bonus' (NCB) in auto insurance?", opts: ["A penalty for claiming", "A discount on premium for not making any claims in the previous year", "Free accessories for the car", "A refund of previous year's premium"], ans: "A discount on premium for not making any claims in the previous year", exp: "NCB acts as a reward to policyholders for prudent driving.", cat: "Insurance" },
];

async function seed() {
    console.log('🌱 Starting Bulk Banking & Insurance Seeder...');
    
    // We already seeded up to 50 days in the future.
    // Let's seed these starting from day 51.
    const today = new Date();
    let count = 0;
    
    for (let i = 0; i < questions.length; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + 51 + i); // Start after current hardcoded
        const dateStr = d.toISOString().split('T')[0];
        
        const q = questions[i];
        
        try {
            await pool.query(
                `INSERT INTO questions (date, question, options, correct_answer, explanation, category) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 ON CONFLICT (date) DO UPDATE SET 
                    question = EXCLUDED.question, 
                    options = EXCLUDED.options, 
                    correct_answer = EXCLUDED.correct_answer, 
                    explanation = EXCLUDED.explanation, 
                    category = EXCLUDED.category`,
                [dateStr, q.q, JSON.stringify(q.opts), q.ans, q.exp, q.cat]
            );
            console.log(`✅ Seeded Banking/Insurance for ${dateStr}`);
            count++;
        } catch (err) {
            console.error(`❌ DB error on ${dateStr}:`, err.message);
        }
    }
    
    console.log(`\n🎉 Successfully pushed ${count} Banking & Insurance questions to Production Database!`);
    await pool.end();
}

seed().catch(console.error);
