const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/today', quizController.getTodayQuiz);
router.get('/random', quizController.getRandomQuestions);
router.post('/submit', quizController.submitAnswer);
router.post('/submit-infinite', quizController.submitInfiniteAnswer);
router.get('/history/:userId', quizController.getQuizHistory);
router.get('/seed-bulk', quizController.bulkSeedQuestions);

module.exports = router;
