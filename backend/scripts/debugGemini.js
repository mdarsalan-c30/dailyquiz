require('dotenv').config({ path: './backend/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We can't easily list models with the SDK without a special method, 
        // but we can try a simple request with a different model name.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkModels();
