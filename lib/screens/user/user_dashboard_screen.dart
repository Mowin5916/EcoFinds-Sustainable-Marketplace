import 'package:flutter/material.dart';
import 'package:ecofinds_sustainable_marketplace/screens/user/my_listings_screen.dart';
import 'package:ecofinds_sustainable_marketplace/screens/user/previous_purchases_screen.dart';
import 'package:ecofinds_sustainable_marketplace/services/api_service.dart';
import 'package:ecofinds_sustainable_marketplace/models/product.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  _UserDashboardScreenState createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  late Future<Map<String, dynamic>> _userProfileFuture;

  @override
  void initState() {
    super.initState();
    _userProfileFuture = ApiService().getUserProfile();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'User Dashboard',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _userProfileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text(
                'Error: ${snapshot.error}',
                style: const TextStyle(color: Colors.white),
              ),
            );
          } else {
            final userProfile = snapshot.data!;
            return Center(
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: Theme.of(context).primaryColor,
                    backgroundImage: userProfile['profileImage'] != null
                        ? NetworkImage(userProfile['profileImage'])
                        : null,
                    child: userProfile['profileImage'] == null
                        ? const Icon(Icons.person, size: 60, color: Colors.black)
                        : null,
                  ),
                  const SizedBox(height: 20),
                  Text(
                    userProfile['username'] ?? 'User Name',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 24),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    userProfile['email'] ?? 'user.email@example.com',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 30),
                  Card(
                    color: Theme.of(context).cardColor,
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.list_alt, color: Colors.white),
                          title: Text(
                            'My Listings',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, color: Colors.white70),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const MyListingsScreen()),
                            );
                          },
                        ),
                        const Divider(color: Colors.white12, height: 1),
                        ListTile(
                          leading: const Icon(Icons.shopping_bag, color: Colors.white),
                          title: Text(
                            'Previous Purchases',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, color: Colors.white70),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => PreviousPurchasesScreen(
                                previousPurchases: (userProfile['previousPurchases'] as List<dynamic>)
                                    .map((p) => Product.fromJson(p)).toList(),
                              )),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }
        },
      ),
    );
  }
}