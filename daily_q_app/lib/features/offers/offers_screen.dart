import 'package:flutter/material.dart';

class OffersScreen extends StatelessWidget {
  const OffersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('💰 Smart Offers', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          _buildOfferCard(
            title: 'Instant Personal Loan',
            description: 'Get up to ₹5,00,000 with minimal documentation.',
            cta: 'Apply Now',
            color: const Color(0xFFFFF7ED),
          ),
          const SizedBox(height: 20),
          _buildOfferCard(
            title: 'Best Credit Card',
            description: 'Earn 5% cashback on all online spends.',
            cta: 'Check Eligibility',
            color: const Color(0xFFEFF6FF), // Light blue tint
          ),
          const SizedBox(height: 20),
          _buildOfferCard(
            title: 'Term Insurance',
            description: 'Secure your family\'s future starting from ₹15/day.',
            cta: 'View Plans',
            color: const Color(0xFFF0FDF4), // Light green tint
          ),
        ],
      ),
    );
  }

  Widget _buildOfferCard({required String title, required String description, required String cta, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.black.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: TextStyle(fontSize: 14, color: Colors.grey[700]),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              // TODO: Open Affiliate Link
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            child: Text(cta, style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
