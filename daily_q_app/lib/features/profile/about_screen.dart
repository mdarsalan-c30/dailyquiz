import 'package:flutter/material.dart';
import 'package:daily_q_app/features/profile/static_page_screen.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('ℹ️ About QWIZO', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: Colors.orange,
              child: Text('Q', style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white)),
            ),
            const SizedBox(height: 16),
            const Text('QWIZO v1.0.0', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 32),
            _buildLinkItem(context, 'About QWIZO', 'about-us'),
            _buildLinkItem(context, 'Privacy Policy', 'privacy-policy'),
            _buildLinkItem(context, 'Terms & Conditions', 'terms-conditions'),
            const SizedBox(height: 48),
            Text(
              'Made with ❤️ for Quiz lovers.',
              style: TextStyle(color: Colors.grey[400], fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLinkItem(BuildContext context, String title, String key) {
    return ListTile(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => StaticPageScreen(pageKey: key),
          ),
        );
      },
    );
  }
}
