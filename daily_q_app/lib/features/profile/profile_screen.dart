import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daily_q_app/core/auth_provider.dart';
import 'package:daily_q_app/features/profile/history_screen.dart';
import 'package:daily_q_app/features/profile/static_page_screen.dart';
import 'package:daily_q_app/features/profile/about_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final String name = user != null ? user['name'] : 'Guest';
    final String email = user != null ? user['email'] : 'Not logged in';

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('👤 Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Center(
                child: Column(
                  children: [
                    const CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.orange,
                      child: Icon(Icons.person, size: 60, color: Colors.white),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      name,
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      email,
                      style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              Row(
                children: [
                  Expanded(
                    child: _buildProfileStat('🔥 Streak', '${user?['streak'] ?? 0} Days'),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildProfileStat('🏆 Points', '${user?['points'] ?? 0}'),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              _buildProfileOption(Icons.history, 'Quiz History', () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const HistoryScreen()));
              }),
              _buildProfileOption(Icons.settings_outlined, 'Settings', () {
                // To be implemented: SettingsScreen
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Settings coming soon!')));
              }),
              _buildProfileOption(Icons.help_outline, 'About & Support', () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const AboutScreen()));
              }),
              const SizedBox(height: 32),
              if (user != null)
                ElevatedButton(
                  onPressed: () {
                    ref.read(authProvider.notifier).logout();
                    Navigator.pushReplacementNamed(context, '/');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[50],
                    foregroundColor: Colors.red,
                    minimumSize: const Size(double.infinity, 56),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: const Text('Logout', style: TextStyle(fontWeight: FontWeight.bold)),
                )
              else
                ElevatedButton(
                  onPressed: () => Navigator.pushReplacementNamed(context, '/'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange[50],
                    foregroundColor: Colors.orange,
                    minimumSize: const Size(double.infinity, 56),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: const Text('Login to Save Progress', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileStat(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.orange.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.orange)),
        ],
      ),
    );
  }

  Widget _buildProfileOption(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.black87),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }

  void _showSupportOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Help & Support', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ListTile(
              leading: const Icon(Icons.email_outlined, color: Colors.blue),
              title: const Text('Email Support'),
              subtitle: const Text('support@dailyq.com'),
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Opening email client: support@dailyq.com')));
              },
            ),
            ListTile(
              leading: const Icon(Icons.shield_outlined, color: Colors.green),
              title: const Text('Privacy Policy'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const StaticPageScreen(pageKey: 'privacy-policy'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
