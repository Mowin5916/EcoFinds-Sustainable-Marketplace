import 'package:flutter/material.dart';
import 'package:ecofinds_sustainable_marketplace/models/product.dart';

class PreviousPurchasesScreen extends StatelessWidget {
  final List<Product> previousPurchases;

  const PreviousPurchasesScreen({required this.previousPurchases, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Previous Purchases',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: previousPurchases.isEmpty
          ? const Center(
              child: Text(
                'You have no previous purchases.',
                style: TextStyle(color: Colors.white70),
              ),
            )
          : ListView.builder(
              itemCount: previousPurchases.length,
              itemBuilder: (context, index) {
                final purchase = previousPurchases[index];
                return Card(
                  color: Theme.of(context).cardColor,
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        purchase.imageUrl,
                        width: 50,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                    ),
                    title: Text(
                      purchase.title,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    subtitle: Text(
                      '\$${purchase.price.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                );
              },
            ),
    );
  }
}