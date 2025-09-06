// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?q=&category=
router.get('/', async (req, res) => {
  try {
    const { q = '', category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (q) {
      // simple case-insensitive title search
      filter.title = { $regex: q, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('seller', 'username profileImage')
      .sort({ createdAt: -1 });

    // IMPORTANT: return an object with a `products` key
    return res.status(200).json({ products });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
