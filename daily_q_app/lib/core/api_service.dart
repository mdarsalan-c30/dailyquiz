import 'package:dio/dio.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://dailyquiz-k7lf.onrender.com/api', // Production Render API
      connectTimeout: const Duration(seconds: 60),
      receiveTimeout: const Duration(seconds: 60),
    ),
  );

  // Auth
  static void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  static void clearToken() {
    _dio.options.headers.remove('Authorization');
  }

  static Future<Response> register(Map<String, dynamic> data) async {
    return await _dio.post('/auth/register', data: data);
  }

  static Future<Response> login(Map<String, dynamic> data) async {
    return await _dio.post('/auth/login', data: data);
  }

  static Future<Response> getUserStats(String firebaseUid) async {
    return await _dio.get('/auth/stats/$firebaseUid');
  }

  // Quiz
  static Future<Response> getTodayQuiz() async {
    return await _dio.get('/quiz/today');
  }

  static Future<Response> submitAnswer(Map<String, dynamic> data) async {
    return await _dio.post('/quiz/submit', data: data);
  }

  static Future<Response> getQuizHistory(int userId) async {
    return await _dio.get('/quiz/history/$userId');
  }

  static Future<Response> getRandomQuestions(int count) async {
    return await _dio.get('/quiz/random?count=$count');
  }

  static Future<Response> submitInfiniteAnswer(Map<String, dynamic> data) async {
    return await _dio.post('/quiz/submit-infinite', data: data);
  }

  // Leaderboard
  static Future<Response> getLeaderboard() async {
    return await _dio.get('/leaderboard');
  }

  // Offers
  static Future<Response> getOffers() async {
    return await _dio.get('/offers');
  }

  // --- CMS / STATIC CONTENT ---
  static Future<Response> getStaticPage(String key) async {
    // Note: Admin routes usually start with /admin, but I'll check/fix backend if needed.
    // For now using /admin/content/:key based on my earlier change.
    return await _dio.get('/admin/content/$key');
  }
}
