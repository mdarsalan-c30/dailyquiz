import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daily_q_app/core/api_service.dart';
import 'package:daily_q_app/core/auth_provider.dart';

class PlayQuizScreen extends ConsumerStatefulWidget {
  const PlayQuizScreen({super.key});

  @override
  ConsumerState<PlayQuizScreen> createState() => _PlayQuizScreenState();
}

class _PlayQuizScreenState extends ConsumerState<PlayQuizScreen> {
  bool isLoading = true;
  List<dynamic> questions = [];
  int currentIndex = 0;
  int score = 0;
  
  int? selectedOption;
  bool isSubmitted = false;
  bool isCorrect = false;
  String? correctAnswer;

  @override
  void initState() {
    super.initState();
    _fetchQuestions();
  }

  Future<void> _fetchQuestions() async {
    try {
      final response = await ApiService.getRandomQuestions(10);
      setState(() {
        questions = response.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  Future<void> _submitAnswer() async {
    if (selectedOption == null || questions.isEmpty) return;
    
    final currentQ = questions[currentIndex];
    final user = ref.read(authProvider).user;

    setState(() => isLoading = true);
    
    try {
      final response = await ApiService.submitInfiniteAnswer({
        'question_id': currentQ['id'],
        'selected_answer': currentQ['options'][selectedOption],
        'userId': user != null ? user['id'] : null,
      });

      setState(() {
        isSubmitted = true;
        isCorrect = response.data['is_correct'];
        correctAnswer = response.data['correct_answer'];
        if (isCorrect) score += 10;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  void _nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setState(() {
        currentIndex++;
        selectedOption = null;
        isSubmitted = false;
        isCorrect = false;
        correctAnswer = null;
      });
    } else {
      _showResultDialog();
    }
  }

  void _showResultDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Quiz Completed!', textAlign: TextAlign.center),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('You earned', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text(
              '+$score Points',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.orange),
            ),
          ],
        ),
        actions: [
          Column(
            children: [
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 12),
                  ),
                  onPressed: () {
                    Navigator.pop(context); // close dialog
                    setState(() {
                      isLoading = true;
                      questions = [];
                      currentIndex = 0;
                      score = 0;
                      selectedOption = null;
                      isSubmitted = false;
                    });
                    _fetchQuestions();
                  },
                  child: const Text('Play Again 🔄', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.pop(context); // dialog
                    Navigator.pop(context, true); // screen
                  },
                  child: Text('Back to Home', style: TextStyle(color: Colors.grey[600])),
                ),
              ),
              const SizedBox(height: 8),
            ],
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading && questions.isEmpty) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
        body: const Center(child: Text('No questions available right now.')),
      );
    }

    final currentQ = questions[currentIndex];
    final String questionText = currentQ['question'];
    final List<dynamic> options = currentQ['options'];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Question ${currentIndex + 1}/${questions.length}',
          style: const TextStyle(color: Colors.black87, fontSize: 16),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LinearProgressIndicator(
                  value: (currentIndex + 1) / questions.length,
                  backgroundColor: Colors.orange.withOpacity(0.2),
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.orange),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
                const SizedBox(height: 32),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7ED),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Text(
                    questionText,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Expanded(
                  child: ListView.separated(
                    itemCount: options.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 16),
                    itemBuilder: (context, index) => _buildOptionTile(index, options[index]),
                  ),
                ),
                if (isSubmitted) _buildResultSection(),
                const SizedBox(height: 16),
                _buildActionButton(),
              ],
            ),
          ),
          if (isLoading && questions.isNotEmpty)
            Container(
              color: Colors.black.withOpacity(0.1),
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  Widget _buildOptionTile(int index, String optionText) {
    bool isSelected = selectedOption == index;
    Color borderColor = Colors.black12;
    Color bgColor = Colors.white;
    Color textColor = Colors.black87;

    if (isSubmitted) {
      if (optionText == correctAnswer) {
        borderColor = Colors.green;
        bgColor = Colors.green.withOpacity(0.1);
        textColor = Colors.green;
      } else if (isSelected && optionText != correctAnswer) {
        borderColor = Colors.red;
        bgColor = Colors.red.withOpacity(0.1);
        textColor = Colors.red;
      }
    } else if (isSelected) {
      borderColor = Colors.orange;
      bgColor = Colors.orange.withOpacity(0.1);
      textColor = Colors.orange;
    }

    return GestureDetector(
      onTap: isSubmitted ? null : () => setState(() => selectedOption = index),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: bgColor,
          border: Border.all(color: borderColor, width: 2),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected || (isSubmitted && optionText == correctAnswer) ? borderColor : Colors.grey,
                  width: 2,
                ),
                color: isSelected && !isSubmitted ? Colors.orange : (isSubmitted && optionText == correctAnswer ? Colors.green : Colors.transparent),
              ),
              child: isSubmitted && optionText == correctAnswer
                  ? const Icon(Icons.check, size: 16, color: Colors.white)
                  : (isSubmitted && isSelected && optionText != correctAnswer
                      ? const Icon(Icons.close, size: 16, color: Colors.red)
                      : null),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                optionText,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textColor),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isCorrect ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isCorrect ? Colors.green : Colors.red),
      ),
      child: Row(
        children: [
          Icon(isCorrect ? Icons.check_circle : Icons.cancel, color: isCorrect ? Colors.green : Colors.red),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              isCorrect ? 'Awesome! That\'s correct.' : 'Oops! Correct answer:\n$correctAnswer',
              style: TextStyle(color: isCorrect ? Colors.green : Colors.red, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: selectedOption == null ? Colors.grey[300] : Colors.orange,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: selectedOption == null ? 0 : 2,
        ),
        onPressed: selectedOption == null 
            ? null 
            : (isSubmitted ? _nextQuestion : _submitAnswer),
        child: Text(
          isSubmitted ? (currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz') : 'Submit Answer',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: selectedOption == null ? Colors.grey[600] : Colors.white,
          ),
        ),
      ),
    );
  }
}
