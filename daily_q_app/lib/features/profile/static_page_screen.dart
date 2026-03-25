import 'package:flutter/material.dart';
import 'package:daily_q_app/core/api_service.dart';

class StaticPageScreen extends StatefulWidget {
  final String pageKey;
  const StaticPageScreen({super.key, required this.pageKey});

  @override
  State<StaticPageScreen> createState() => _StaticPageScreenState();
}

class _StaticPageScreenState extends State<StaticPageScreen> {
  String title = 'Loading...';
  String content = '';
  bool isLoading = true;
  bool hasError = false;
  int _retryCount = 0;

  @override
  void initState() {
    super.initState();
    _fetchContent();
  }

  Future<void> _fetchContent() async {
    setState(() {
      isLoading = true;
      hasError = false;
    });

    // Retry up to 2 times (Render cold starts can cause first request to fail)
    for (int attempt = 0; attempt <= 2; attempt++) {
      try {
        final response = await ApiService.getStaticPage(widget.pageKey);
        if (!mounted) return;
        setState(() {
          title = response.data['title'] ?? widget.pageKey;
          content = response.data['content'] ?? 'No content available.';
          isLoading = false;
          hasError = false;
        });
        return;
      } catch (e) {
        if (attempt < 2) {
          await Future.delayed(const Duration(seconds: 2));
          continue;
        }
        if (!mounted) return;
        setState(() {
          title = widget.pageKey.replaceAll('-', ' ').toUpperCase();
          content = '';
          isLoading = false;
          hasError = true;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(title, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orange))
          : hasError
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.cloud_off, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text('Could not load content', style: TextStyle(fontSize: 16, color: Colors.grey[600])),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: _fetchContent,
                        icon: const Icon(Icons.refresh),
                        label: const Text('Retry'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Text(
                    content,
                    style: const TextStyle(fontSize: 16, height: 1.6, color: Colors.black87),
                  ),
                ),
    );
  }
}
