import 'package:flutter/material.dart';
import 'package:daily_q_app/core/api_service.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  List<dynamic> participants = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLeaderboard();
  }

  Future<void> _fetchLeaderboard() async {
    try {
      final response = await ApiService.getLeaderboard();
      setState(() {
        participants = response.data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('🏆 Leaderboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        children: [
          if (participants.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.05),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  if (participants.length > 1) _buildTopThree(rank: 2, name: participants[1]['name'], points: '${participants[1]['points']}', color: Colors.grey),
                  if (participants.isNotEmpty) _buildTopThree(rank: 1, name: participants[0]['name'], points: '${participants[0]['points']}', color: Colors.orange, isLarge: true),
                  if (participants.length > 2) _buildTopThree(rank: 3, name: participants[2]['name'], points: '${participants[2]['points']}', color: Colors.brown[400]!),
                ],
              ),
            ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(vertical: 20),
              itemCount: participants.length,
              separatorBuilder: (context, index) => const Divider(height: 1, indent: 80),
              itemBuilder: (context, index) {
                final user = participants[index];
                return _buildLeaderboardTile(user, index + 1);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopThree({required int rank, required String name, required String points, required Color color, bool isLarge = false}) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.bottomCenter,
          children: [
            Container(
              width: isLarge ? 80 : 60,
              height: isLarge ? 80 : 60,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: color, width: 3),
                color: Colors.white,
              ),
              child: const Center(child: Icon(Icons.person, size: 40, color: Colors.grey)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text('#$rank', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text('$points pts', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
      ],
    );
  }

  Widget _buildLeaderboardTile(dynamic user, int rank) {
    bool isMe = user['name'] == 'You' || user['name'] == 'Arsalan';
    return Container(
      color: isMe ? Colors.orange.withOpacity(0.05) : Colors.transparent,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          Text('$rank', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(width: 24),
          const CircleAvatar(backgroundColor: Colors.grey, child: Icon(Icons.person, color: Colors.white)),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              user['name'],
              style: TextStyle(
                fontSize: 16,
                fontWeight: isMe ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
          Text(
            '${user['points']} pts',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
