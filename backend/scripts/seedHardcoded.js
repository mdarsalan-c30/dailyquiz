require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 60 hardcoded finance/economics questions spread over 60 days
const questions = [
    { q: "What does 'IPO' stand for?", opts: ["Initial Public Offering","International Purchase Order","Investment Portfolio Option","Institutional Price Operations"], ans: "Initial Public Offering", exp: "An IPO is when a private company first sells its shares to the public.", cat: "Stock Market" },
    { q: "What is the primary purpose of the Reserve Bank of India (RBI)?", opts: ["Collect taxes","Regulate monetary policy","Issue passports","Build infrastructure"], ans: "Regulate monetary policy", exp: "RBI is India's central bank and manages the country's monetary policy.", cat: "Macroeconomics" },
    { q: "What does 'bull market' mean?", opts: ["Market is falling","Market is rising","Market is closed","Market is volatile"], ans: "Market is rising", exp: "A bull market refers to a period of rising stock prices.", cat: "Stock Market" },
    { q: "What is a 'mutual fund'?", opts: ["A government tax","A pooled investment vehicle","A type of bank loan","A savings account"], ans: "A pooled investment vehicle", exp: "A mutual fund pools money from many investors to buy a diversified portfolio.", cat: "Personal Finance" },
    { q: "What is 'inflation'?", opts: ["Decrease in prices","Increase in general price level","Stock market crash","Currency appreciation"], ans: "Increase in general price level", exp: "Inflation is the rate at which prices for goods and services rise over time.", cat: "Macroeconomics" },
    { q: "What is the 'Sensex'?", opts: ["A tax index","BSE benchmark index","A bank rate","A GDP measure"], ans: "BSE benchmark index", exp: "Sensex is the benchmark index of the Bombay Stock Exchange (BSE).", cat: "Stock Market" },
    { q: "What does 'SIP' stand for in investing?", opts: ["Stock Investment Plan","Systematic Investment Plan","Savings Interest Policy","Secure Income Program"], ans: "Systematic Investment Plan", exp: "SIP allows investors to invest a fixed amount regularly in mutual funds.", cat: "Personal Finance" },
    { q: "What is 'GDP'?", opts: ["Gross Domestic Product","General Distribution Policy","Government Debt Percentage","Global Development Plan"], ans: "Gross Domestic Product", exp: "GDP measures the total value of goods and services produced in a country.", cat: "Macroeconomics" },
    { q: "What is a 'stock dividend'?", opts: ["Interest on savings","Extra shares issued to shareholders","A type of bond","A bank fee"], ans: "Extra shares issued to shareholders", exp: "A stock dividend pays shareholders in additional shares instead of cash.", cat: "Stock Market" },
    { q: "What is 'compound interest'?", opts: ["Interest on principal only","Interest on interest","Fixed annual rate","Government bond yield"], ans: "Interest on interest", exp: "Compound interest earns returns on both the principal and previously earned interest.", cat: "Personal Finance" },
    { q: "What is a 'bear market'?", opts: ["Rising market","Falling market","Stable market","New market"], ans: "Falling market", exp: "A bear market is when stock prices fall 20% or more from recent highs.", cat: "Stock Market" },
    { q: "What does 'NIFTY 50' represent?", opts: ["Top 50 NSE companies","50 government bonds","50 foreign companies","50 commodities"], ans: "Top 50 NSE companies", exp: "NIFTY 50 is NSE's benchmark index tracking the top 50 companies.", cat: "Stock Market" },
    { q: "What is 'repo rate'?", opts: ["Rate banks lend to public","Rate RBI lends to banks","Foreign exchange rate","Inflation rate"], ans: "Rate RBI lends to banks", exp: "Repo rate is the rate at which the RBI lends money to commercial banks.", cat: "Macroeconomics" },
    { q: "What is 'diversification' in investing?", opts: ["Buying one stock","Spreading investments across assets","Selling all assets","Taking a loan"], ans: "Spreading investments across assets", exp: "Diversification reduces risk by spreading investments across different assets.", cat: "Personal Finance" },
    { q: "What is 'net worth'?", opts: ["Annual salary","Assets minus liabilities","Total bank balance","Company revenue"], ans: "Assets minus liabilities", exp: "Net worth is calculated by subtracting total liabilities from total assets.", cat: "Personal Finance" },
    { q: "What is a 'blue chip stock'?", opts: ["Penny stock","Shares of small startup","Shares of established large company","Government bond"], ans: "Shares of established large company", exp: "Blue chip stocks are shares of large, well-established, financially stable companies.", cat: "Stock Market" },
    { q: "What does 'P/E ratio' measure?", opts: ["Profit vs Expenses","Price vs Earnings","Product vs Efficiency","Portfolio vs Equity"], ans: "Price vs Earnings", exp: "P/E ratio compares a stock's price to its earnings per share.", cat: "Stock Market" },
    { q: "What is 'FD' in banking?", opts: ["Foreign Deposit","Fixed Deposit","Flexible Draft","Fund Distribution"], ans: "Fixed Deposit", exp: "A Fixed Deposit locks in money for a fixed period at a guaranteed interest rate.", cat: "Personal Finance" },
    { q: "What is 'fiscal policy'?", opts: ["Central bank interest rates","Government spending and taxation","Foreign trade rules","Stock market regulation"], ans: "Government spending and taxation", exp: "Fiscal policy refers to government decisions on spending and taxation to influence the economy.", cat: "Macroeconomics" },
    { q: "What is 'market capitalization'?", opts: ["Company's total debt","Total value of shares outstanding","Annual profit","Revenue per quarter"], ans: "Total value of shares outstanding", exp: "Market cap = share price × total number of outstanding shares.", cat: "Stock Market" },
    { q: "What is an 'ETF'?", opts: ["Electronic Transfer Fund","Exchange Traded Fund","Equity Tax Formula","Estimated Tax File"], ans: "Exchange Traded Fund", exp: "An ETF tracks an index or basket of assets and trades on a stock exchange.", cat: "Stock Market" },
    { q: "What is 'EMI'?", opts: ["Equated Monthly Installment","Extra Monthly Income","Economic Market Index","Equity Market Interest"], ans: "Equated Monthly Installment", exp: "EMI is the fixed monthly amount paid to repay a loan over time.", cat: "Personal Finance" },
    { q: "What does 'ROI' stand for?", opts: ["Rate of Inflation","Return on Investment","Risk of Insolvency","Revenue over Income"], ans: "Return on Investment", exp: "ROI measures the profitability of an investment as a percentage of its cost.", cat: "Personal Finance" },
    { q: "What is 'demat account'?", opts: ["Bank savings account","Account for holding shares electronically","Loan account","Tax savings account"], ans: "Account for holding shares electronically", exp: "A demat account holds shares and securities in electronic form.", cat: "Stock Market" },
    { q: "What is 'CPI'?", opts: ["Central Price Index","Consumer Price Index","Corporate Profit Index","Capital Price Indicator"], ans: "Consumer Price Index", exp: "CPI measures changes in the price level of a basket of consumer goods and services.", cat: "Macroeconomics" },
    { q: "What is a 'bond'?", opts: ["Company ownership","Debt instrument","Mutual fund","Savings plan"], ans: "Debt instrument", exp: "A bond is a loan made by an investor to a borrower (government or corporation).", cat: "Stock Market" },
    { q: "What is 'hedging'?", opts: ["Buying more stocks","Reducing risk with offsetting positions","Selling all investments","Borrowing to invest"], ans: "Reducing risk with offsetting positions", exp: "Hedging uses financial instruments to offset potential losses in investments.", cat: "Personal Finance" },
    { q: "What is 'liquidity' in finance?", opts: ["How profitable something is","How easily an asset is converted to cash","Amount of debt","Growth rate"], ans: "How easily an asset is converted to cash", exp: "Liquidity refers to how quickly and easily an asset can be converted to cash.", cat: "Personal Finance" },
    { q: "What is 'SEBI'?", opts: ["State Economic Bureau of India","Securities and Exchange Board of India","Stock Exchange Board of Investors","Systematic Equity Bureau Index"], ans: "Securities and Exchange Board of India", exp: "SEBI is the regulatory body for securities markets in India.", cat: "Stock Market" },
    { q: "What is 'monetary policy'?", opts: ["Government tax decisions","Central bank control of money supply","Company pricing strategy","Stock market rules"], ans: "Central bank control of money supply", exp: "Monetary policy uses interest rates and money supply to manage the economy.", cat: "Macroeconomics" },
    { q: "What is 'portfolio rebalancing'?", opts: ["Selling all assets","Realigning asset weights to match target allocation","Adding more money","Taking profits only"], ans: "Realigning asset weights to match target allocation", exp: "Rebalancing restores a portfolio to its original target asset allocation.", cat: "Personal Finance" },
    { q: "What does 'upper circuit' mean in stock markets?", opts: ["Stock price falls to limit","Stock price rises to daily limit","Trading volume cap","Market opening time"], ans: "Stock price rises to daily limit", exp: "Upper circuit is a price ceiling beyond which a stock cannot rise in a single trading session.", cat: "Stock Market" },
    { q: "What is 'TDS'?", opts: ["Tax Deducted at Source","Total Debt Sum","Temporary Deposit System","Trade Deduction Standard"], ans: "Tax Deducted at Source", exp: "TDS is a tax collection mechanism where tax is deducted at the point of income.", cat: "Personal Finance" },
    { q: "What is 'working capital'?", opts: ["Total company assets","Current assets minus current liabilities","Long-term investments","Annual profit"], ans: "Current assets minus current liabilities", exp: "Working capital measures short-term financial health and operational efficiency.", cat: "Macroeconomics" },
    { q: "What is an 'index fund'?", opts: ["Fund managed by experts","Fund that tracks a market index","Government savings scheme","Fixed deposit fund"], ans: "Fund that tracks a market index", exp: "An index fund passively tracks a market index like NIFTY 50 or Sensex.", cat: "Personal Finance" },
    { q: "What does 'NSE' stand for?", opts: ["National Savings Exchange","National Stock Exchange","New Securities Entity","National Securities Evaluation"], ans: "National Stock Exchange", exp: "NSE is India's largest stock exchange by trading volume.", cat: "Stock Market" },
    { q: "What is 'stop-loss' in trading?", opts: ["Maximum profit target","Order to sell when price falls to a set level","Portfolio diversification","Tax saving tool"], ans: "Order to sell when price falls to a set level", exp: "A stop-loss order automatically sells a security when it hits a specified price to limit losses.", cat: "Stock Market" },
    { q: "What is 'NPA' in banking?", opts: ["Net Profit Amount","Non-Performing Asset","New Policy Announcement","National Payment Authority"], ans: "Non-Performing Asset", exp: "An NPA is a loan or advance for which principal or interest payment is overdue by more than 90 days.", cat: "Macroeconomics" },
    { q: "What is 'equity'?", opts: ["Loan amount","Ownership interest in a company","Interest rate","Government bond"], ans: "Ownership interest in a company", exp: "Equity represents the ownership stake shareholders have in a company.", cat: "Stock Market" },
    { q: "What is 'PPF'?", opts: ["Personal Profit Fund","Public Provident Fund","Private Payment Format","Pension Policy Formula"], ans: "Public Provident Fund", exp: "PPF is a government-backed long-term savings scheme with tax benefits in India.", cat: "Personal Finance" },
    { q: "What is 'ELSS'?", opts: ["Exchange Listed Savings Scheme","Equity Linked Savings Scheme","Electronic Loan Settlement System","Extra Large Savings Standard"], ans: "Equity Linked Savings Scheme", exp: "ELSS is a tax-saving mutual fund with a lock-in period of 3 years.", cat: "Personal Finance" },
    { q: "What is 'alpha' in investing?", opts: ["Total market return","Excess return over benchmark","Market volatility measure","Risk-free rate"], ans: "Excess return over benchmark", exp: "Alpha measures a fund's performance relative to its benchmark index.", cat: "Stock Market" },
    { q: "What is 'beta' in finance?", opts: ["Fixed return rate","Measure of stock volatility relative to market","Company profit ratio","Government rate"], ans: "Measure of stock volatility relative to market", exp: "Beta measures how much a stock's price moves relative to the overall market.", cat: "Stock Market" },
    { q: "What is 'GST'?", opts: ["Government Services Tax","Goods and Services Tax","General Savings Target","Growth Standard Threshold"], ans: "Goods and Services Tax", exp: "GST is a unified indirect tax levied on the supply of goods and services in India.", cat: "Macroeconomics" },
    { q: "What is 'FII'?", opts: ["Fixed Income Investment","Foreign Institutional Investor","Financial Index Indicator","Funded Interest Income"], ans: "Foreign Institutional Investor", exp: "FIIs are organizations from outside India that invest in India's financial markets.", cat: "Stock Market" },
    { q: "What is 'asset allocation'?", opts: ["Buying one type of asset","Distributing investments across asset classes","Paying dividends","Taking loans"], ans: "Distributing investments across asset classes", exp: "Asset allocation divides investments among categories like stocks, bonds, and cash.", cat: "Personal Finance" },
    { q: "What is 'depreciation' of currency?", opts: ["Currency gaining value","Currency losing value relative to others","Interest rate cut","Government borrowing"], ans: "Currency losing value relative to others", exp: "Currency depreciation means a country's currency is worth less compared to other currencies.", cat: "Macroeconomics" },
    { q: "What is 'CAGR'?", opts: ["Current Annual Growth Rate","Compound Annual Growth Rate","Capital Asset Growth Ratio","Calculated Annual Gain Return"], ans: "Compound Annual Growth Rate", exp: "CAGR shows the rate at which an investment grows annually over a specified time period.", cat: "Personal Finance" },
    { q: "What is a 'rights issue'?", opts: ["Legal dispute","Offer for existing shareholders to buy new shares at discount","Government regulation","Company merger"], ans: "Offer for existing shareholders to buy new shares at discount", exp: "A rights issue lets existing shareholders buy additional shares at a discounted price.", cat: "Stock Market" },
    { q: "What does 'market order' mean?", opts: ["Buy/sell at a specific price","Buy/sell immediately at current price","Wait for best price","Limit buying to a set quantity"], ans: "Buy/sell immediately at current price", exp: "A market order executes a trade immediately at the best available current price.", cat: "Stock Market" },
];

async function seed() {
    console.log('🌱 Starting hardcoded question seeding...');
    const today = new Date();
    let seeded = 0;
    let skipped = 0;

    for (let i = 0; i < questions.length; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        try {
            // Check if date already has a question
            const { rows } = await pool.query('SELECT id FROM questions WHERE date = $1', [dateStr]);
            if (rows.length > 0) {
                console.log(`⏩ Skipping ${dateStr} (already exists)`);
                skipped++;
                continue;
            }

            const q = questions[i % questions.length];
            await pool.query(
                'INSERT INTO questions (date, question, options, correct_answer, explanation, category) VALUES ($1, $2, $3, $4, $5, $6)',
                [dateStr, q.q, JSON.stringify(q.opts), q.ans, q.exp, q.cat]
            );
            console.log(`✅ [${i+1}/${questions.length}] Seeded: ${dateStr} — ${q.cat}`);
            seeded++;
        } catch (err) {
            console.error(`❌ Error for ${dateStr}:`, err.message);
        }
    }

    console.log(`\n🏁 Done! Seeded: ${seeded} | Skipped: ${skipped}`);
    await pool.end();
}

seed().catch(console.error);
