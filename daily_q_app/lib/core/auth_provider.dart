import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:daily_q_app/core/api_service.dart';

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});

class AuthState {
  final Map<String, dynamic>? user;
  final String? token;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.token,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    Map<String, dynamic>? user,
    String? token,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  bool get isAuthenticated => token != null;
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    // Start loading session immediately
    Future.microtask(() => _loadSession());
    return AuthState(isLoading: true); 
  }

  Future<void> _loadSession() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('jwt_token');
      final userJson = prefs.getString('user_data');

      if (token != null && userJson != null) {
        ApiService.setToken(token);
        state = state.copyWith(
          token: token,
          user: jsonDecode(userJson),
          isLoading: false,
        );
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await ApiService.login({
        'email': email,
        'password': password,
      });

      final token = response.data['token'];
      final user = response.data['user'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', token);
      await prefs.setString('user_data', jsonEncode(user));

      ApiService.setToken(token);
      state = state.copyWith(isLoading: false, user: user, token: token);
      return true;
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'Login failed. Please check your credentials.';
      state = state.copyWith(isLoading: false, error: message);
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'An unexpected error occurred.');
      return false;
    }
  }

  Future<bool> register(String email, String password, String name) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await ApiService.register({
        'email': email,
        'password': password,
        'name': name,
      });
      state = state.copyWith(isLoading: false);
      return await login(email, password);
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'Registration failed.';
      state = state.copyWith(isLoading: false, error: message);
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'An unexpected error occurred during registration.');
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_data');
    ApiService.clearToken();
    state = AuthState();
  }
}
