import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:daily_q_app/core/ad_helper.dart';
import 'package:daily_q_app/core/api_service.dart';
import 'package:daily_q_app/core/auth_provider.dart';

class QuizScreen extends ConsumerStatefulWidget {
  const QuizScreen({super.key});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  int? selectedOption;
  bool isSubmitted = false;
  bool isCorrect = false;
  String? correctAnswer;
  bool isLoading = true;
  InterstitialAd? _interstitialAd;

  @override
  void initState() {
    super.initState();
    _fetchQuiz();
    _loadInterstitialAd();
  }

  void _loadInterstitialAd() {
    InterstitialAd.load(
      adUnitId: AdHelper.interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
        },
        onAdFailedToLoad: (err) {
          _interstitialAd = null;
        },
      ),
    );
  }

  @override
  void dispose() {
    _interstitialAd?.dispose();
    super.dispose();
  }

  Map<String, dynamic>? quizData;

  @override
  void initState() {
    super.initState();
    _fetchQuiz();
  }

  Future<void> _fetchQuiz() async {
    try {
      final response = await ApiService.getTodayQuiz();
      setState(() {
        quizData = response.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      // Handle error
    }
  }

  Future<void> _submitAnswer() async {
    if (selectedOption == null || quizData == null) return;
    
    final user = ref.read(authProvider).user;
    if (user == null) {
       // Optional: Handle guest submission or prompt login
    }

    setState(() => isLoading = true);
    
    try {
      final response = await ApiService.submitAnswer({
        'question_id': quizData!['id'],
        'selected_answer': quizData!['options'][selectedOption],
        'userId': user != null ? user['id'] : null,
      });

      setState(() {
        isSubmitted = true;
        isCorrect = response.data['is_correct'];
        correctAnswer = response.data['correct_answer'];
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        String msg = 'An error occurred. Please try again.';
        if (e is DioException && e.response?.statusCode == 400) {
          msg = e.response?.data?['message'] ?? 'Already answered today!';
        }
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (quizData == null) {
      return Scaffold(
        appBar: AppBar(backgroundColor: Colors.white, elevation: 0),
        body: const Center(child: Text('No quiz for today.')),
      );
    }

    final question = quizData!['question'];
    final List<dynamic> options = quizData!['options'];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Today\'s Challenge',
          style: TextStyle(color: Colors.black87, fontSize: 16),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF7ED), // Light orange tint
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
                question,
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
                itemBuilder: (context, index) {
                  return _buildOptionTile(index);
                },
              ),
            ),
            if (isSubmitted) _buildResultSection(),
            const SizedBox(height: 16),
            _buildActionButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionTile(int index) {
    bool isSelected = selectedOption == index;
    Color borderColor = Colors.black12;
    Color bgColor = Colors.white;

    if (isSubmitted) {
      if (quizData!['options'][index] == correctAnswer) { // Real Correct Answer from server
        borderColor = Colors.green;
        bgColor = Colors.green.withOpacity(0.1);
      } else if (isSelected) { // Selected but wrong
        borderColor = Colors.red;
        bgColor = Colors.red.withOpacity(0.1);
      }
    } else if (isSelected) {
      borderColor = Colors.orange;
      bgColor = Colors.orange.withOpacity(0.05);
    }

    return GestureDetector(
      onTap: isSubmitted ? null : () => setState(() => selectedOption = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected || (isSubmitted && index == 0) ? borderColor : Colors.black12,
                  width: 2,
                ),
                color: isSelected || (isSubmitted && index == 0) ? borderColor : Colors.transparent,
              ),
              child: Center(
                child: Text(
                  String.fromCharCode(65 + index),
                  style: TextStyle(
                    color: isSelected || (isSubmitted && index == 0) ? Colors.white : Colors.black54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                quizData!['options'][index],
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  color: Colors.black87,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultSection() {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isCorrect ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isCorrect ? Icons.check_circle : Icons.cancel,
                color: isCorrect ? Colors.green : Colors.red,
              ),
              const SizedBox(width: 8),
              Text(
                isCorrect ? 'Correct' : 'Incorrect',
                style: TextStyle(
                  color: isCorrect ? Colors.green : Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            quizData!['explanation'] ?? '',
            style: const TextStyle(color: Colors.black87, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton() {
    return ElevatedButton(
      onPressed: selectedOption == null 
          ? null 
          : (isSubmitted 
              ? () {
                  if (_interstitialAd != null) {
                    _interstitialAd!.show();
                  }
                  Navigator.pop(context, true);
                } 
              : _submitAnswer),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 56),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        elevation: 0,
      ),
      child: Text(
        isSubmitted ? 'Back to Home' : 'Submit Answer',
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }
}
