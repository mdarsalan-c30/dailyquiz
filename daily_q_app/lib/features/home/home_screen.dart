import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daily_q_app/core/api_service.dart';
import 'package:daily_q_app/core/auth_provider.dart';
import 'package:daily_q_app/features/quiz/quiz_screen.dart';
import 'package:daily_q_app/features/quiz/play_quiz_screen.dart';
import 'package:daily_q_app/features/profile/history_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  Map<String, dynamic>? stats;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  Future<void> _fetchStats() async {
    final user = ref.read(authProvider).user;
    if (user == null) {
      setState(() => isLoading = false);
      return;
    }

    try {
      final response = await ApiService.getUserStats(user['id'].toString());
      setState(() {
        stats = response.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final String displayName = user != null ? user['name'] : 'Guest';

    if (isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hi, $displayName 👋',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Ready for today?',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  const CircleAvatar(
                    radius: 24,
                    backgroundColor: Colors.orange,
                    child: Icon(Icons.person, color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              _buildMainQuizCard(context),
              const SizedBox(height: 16),
              _buildDailyQuizLink(context),
              const SizedBox(height: 32),
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      icon: Icons.local_fire_department,
                      label: 'Streak',
                      value: '${stats?['streak'] ?? 0}',
                      color: Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      icon: Icons.emoji_events,
                      label: 'Points',
                      value: '${stats?['points'] ?? 0}',
                      color: Colors.blue,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              _buildHistoryLink(context),
              if (user != null) ...[
                const SizedBox(height: 32),
                TextButton.icon(
                  onPressed: () {
                    ref.read(authProvider.notifier).logout();
                    Navigator.pushReplacementNamed(context, '/'); 
                  },
                  icon: const Icon(Icons.logout, color: Colors.red),
                  label: const Text('Logout', style: TextStyle(color: Colors.red)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMainQuizCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.orange, Colors.deepOrange],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.orange.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'PLAY QUIZ',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Test your knowledge with 10 random questions!',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () async {
              final result = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const PlayQuizScreen()),
              );
              if (result == true) {
                // Refresh points/stats if quiz completed
                _fetchStats();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.orange,
              minimumSize: const Size(double.infinity, 56),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              elevation: 0,
            ),
            child: const Text(
              'Start Playing →',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyQuizLink(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: ListTile(
        onTap: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const QuizScreen()),
          );
          if (result == true) {
            _fetchStats();
          }
        },
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.green.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.calendar_today, color: Colors.green, size: 20),
        ),
        title: const Text(
          'Daily Challenge',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          'Answer the singular question of the day',
          style: TextStyle(color: Colors.grey[600], fontSize: 12),
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      ),
    );
  }

  Widget _buildHistoryLink(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const HistoryScreen()),
          );
        },
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.history, color: Colors.blue, size: 20),
        ),
        title: const Text(
          'Quiz History',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Text(
          'Review your past performances',
          style: TextStyle(color: Colors.grey[600], fontSize: 12),
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 12),
          Text(
            label,
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
