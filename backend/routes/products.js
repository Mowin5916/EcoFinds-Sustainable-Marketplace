const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { getEcoScore } = require('../utils/eco');

const router = express.Router();

// GET /api/products?q=&category=
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 }).populate('seller', 'username profileImage');
    // attach eco data
    const result = products.map(p => {
      const eco = getEcoScore(p.category);
      return { ...p.toObject(), eco };
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate('seller', 'username profileImage');
    if (!p) return res.status(404).json({ message: 'Not found' });
    const eco = getEcoScore(p.category);
    res.json({ ...p.toObject(), eco });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create product (auth)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, price, image } = req.body;
    if (!title || !category || price === undefined) return res.status(400).json({ message: 'Missing fields' });
    const product = new Product({
      title,
      description: description || '',
      category,
      price,
      image: image || 'https://via.placeholder.com/400x300?text=No+Image',
      seller: req.user._id
    });
    await product.save();
    const eco = getEcoScore(product.category);
    res.json({ ...product.toObject(), eco });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update product (auth + owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    const { title, description, category, price, image } = req.body;
    p.title = title ?? p.title;
    p.description = description ?? p.description;
    p.category = category ?? p.category;
    p.price = price ?? p.price;
    p.image = image ?? p.image;
    await p.save();
    const eco = getEcoScore(p.category);
    res.json({ ...p.toObject(), eco });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product (auth + owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.seller.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    await p.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
