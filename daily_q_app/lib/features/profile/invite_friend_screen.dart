import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:daily_q_app/core/auth_provider.dart';
import 'package:share_plus/share_plus.dart';

class InviteFriendScreen extends ConsumerWidget {
  const InviteFriendScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    final String referralCode = user?['referral_code'] ?? 'LOGIN_TO_GET_CODE';

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('🤝 Invite & Earn', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(Icons.stars_rounded, size: 100, color: Colors.orange),
            const SizedBox(height: 24),
            const Text(
              'Earn 10 Bonus Points!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              'Invite your friends to QWIZO. When they sign up using your code, both of you get special rewards!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
            const SizedBox(height: 40),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.05),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.orange.withOpacity(0.1)),
              ),
              child: Column(
                children: [
                  const Text('YOUR REFERRAL CODE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.orange)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        referralCode,
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: 2),
                      ),
                      const SizedBox(width: 12),
                      IconButton(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: referralCode));
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code copied to clipboard!')));
                        },
                        icon: const Icon(Icons.copy, color: Colors.grey),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),
            ElevatedButton(
              onPressed: () {
                Share.share('Hey! Join me on QWIZO and earn points together. Use my referral code: $referralCode \nDownload now: https://qwizo.com/download');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
              child: const Text('INVITE FRIENDS', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),
            Text(
              '* Points are credited instantly after successful registration.',
              style: TextStyle(fontSize: 11, color: Colors.grey[400]),
            ),
          ],
        ),
      ),
    );
  }
}
