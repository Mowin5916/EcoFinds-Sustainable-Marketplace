import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ecofinds_sustainable_marketplace/models/product.dart';
import 'package:ecofinds_sustainable_marketplace/models/eco.dart';

class ApiService {
  static const String _baseUrl = 'https://ecofinds-sustainable-marketplace.onrender.com/api';
  static String? _authToken;

  static void setAuthToken(String token) {
    _authToken = token;
  }

  static String? getAuthToken() {
    return _authToken;
  }

  Map<String, String> _getHeaders({bool useAuth = true}) {
    final headers = {'Content-Type': 'application/json'};
    if (useAuth && _authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  // --- Authentication Endpoints ---

  Future<bool> loginUser(String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: _getHeaders(useAuth: false),
      body: json.encode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setAuthToken(data['token']);
      return true;
    }
    return false;
  }

  Future<bool> registerUser(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/signup'),
      headers: _getHeaders(useAuth: false),
      body: json.encode({'username': username, 'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      setAuthToken(data['token']);
      return true;
    }
    return false;
  }

  // --- Product Endpoints ---

  Future<List<Product>> getProducts() async {
    final response = await http.get(Uri.parse('$_baseUrl/products'));

    if (response.statusCode == 200) {
      final List<dynamic> productJson = json.decode(response.body)['products'];
      return productJson.map((json) => Product.fromJson(json)).toList();
    }
    throw Exception('Failed to load products');
  }

  Future<bool> addProduct(Map<String, dynamic> productData) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/products'),
      headers: _getHeaders(),
      body: json.encode(productData),
    );
    return response.statusCode == 201;
  }

  Future<bool> updateProduct(String id, Map<String, dynamic> updatedData) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/products/$id'),
      headers: _getHeaders(),
      body: json.encode(updatedData),
    );
    return response.statusCode == 200;
  }

  Future<bool> deleteProduct(String id) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/products/$id'),
      headers: _getHeaders(),
    );
    return response.statusCode == 200;
  }

  // --- User Endpoints ---
  Future<Map<String, dynamic>> getUserProfile() async {
    final response = await http.get(Uri.parse('$_baseUrl/user/me'), headers: _getHeaders());

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to load user profile');
  }
  
  Future<List<Product>> getMyListings() async {
    final response = await http.get(Uri.parse('$_baseUrl/user/me'), headers: _getHeaders());
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final List<dynamic> listingsJson = data['itemsSold'];
      return listingsJson.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load my listings');
    }
  }
  
  // --- Cart Endpoints ---
  Future<Map<String, dynamic>> getCart() async {
    final response = await http.get(Uri.parse('$_baseUrl/cart'), headers: _getHeaders());

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to load cart');
  }

  Future<bool> addToCart(String productId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/cart'),
      headers: _getHeaders(),
      body: json.encode({'productId': productId}),
    );
    return response.statusCode == 200;
  }
  
  Future<bool> removeFromCart(String productId) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/cart/$productId'),
      headers: _getHeaders(),
    );
    return response.statusCode == 200;
  }

  Future<bool> checkout() async {
    final response = await http.post(
      Uri.parse('$_baseUrl/cart/checkout'),
      headers: _getHeaders(),
    );
    return response.statusCode == 200;
  }
}