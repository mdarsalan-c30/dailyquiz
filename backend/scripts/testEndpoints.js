const axios = require('axios');

async function testApi() {
    try {
        console.log('Testing Daily...');
        const res1 = await axios.get('https://dailyquiz-k7lf.onrender.com/api/quiz/today');
        console.log('Daily status:', res1.status, typeof res1.data.options);
        
        console.log('Testing Random...');
        const res2 = await axios.get('https://dailyquiz-k7lf.onrender.com/api/quiz/random?count=5');
        console.log('Random status:', res2.status, res2.data.length);
    } catch(e) {
        console.error('Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message);
    }
}
testApi();
