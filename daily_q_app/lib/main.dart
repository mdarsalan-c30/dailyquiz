import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:daily_q_app/features/auth/splash_screen.dart';
import 'package:google_fonts/google_fonts.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  runApp(
    const ProviderScope(
      child: DailyQApp(),
    ),
  );
}

class DailyQApp extends StatelessWidget {
  const DailyQApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QWIZO - Bike, Car & Health Insurance Quiz',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.orange,
          primary: Colors.orange,
        ),
        textTheme: GoogleFonts.interTextTheme(),
      ),
      home: const SplashScreen(),
    );
  }
}
