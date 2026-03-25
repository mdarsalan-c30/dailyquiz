import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daily_q_app/core/auth_provider.dart';
import 'package:daily_q_app/features/auth/login_screen.dart';
import 'package:daily_q_app/main_navigation.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _tryNavigate();
      }
    });

    _controller.forward();

    // Safety: always navigate after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      _tryNavigate();
    });
  }

  void _tryNavigate() {
    if (_hasNavigated || !mounted) return;
    final authState = ref.read(authProvider);
    
    // If still loading auth, wait a bit more — but not forever
    if (authState.isLoading) {
      Future.delayed(const Duration(milliseconds: 500), () {
        _forceNavigate();
      });
      return;
    }
    
    _doNavigate(authState.isAuthenticated);
  }

  void _forceNavigate() {
    if (_hasNavigated || !mounted) return;
    final authState = ref.read(authProvider);
    _doNavigate(authState.isAuthenticated);
  }

  void _doNavigate(bool isAuthenticated) {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;

    final screen = isAuthenticated
        ? const MainNavigation()
        : const LoginScreen();

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => screen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 600),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Listen to auth state — navigate when loading finishes
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (!next.isLoading && _controller.isCompleted) {
        _tryNavigate();
      }
    });

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: Colors.orange,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.orange.withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      )
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'Q',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 70,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'QWIZO',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Smart Insurance Insights',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                    letterSpacing: 1.2,
                    fontWeight: FontWeight.w300,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
