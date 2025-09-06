const express = require('express');
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
const User = require('../models/User');

const router = express.Router();

// GET /api/cart  -> get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart  -> add product to cart { productId }
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [{ product: productId, qty: 1 }] });
    } else {
      const idx = cart.items.findIndex(i => i.product.toString() === productId);
      if (idx >= 0) cart.items[idx].qty += 1;
      else cart.items.push({ product: productId, qty: 1 });
    }
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart/:productId -> remove item
router.delete('/:productId', auth, async (req, res) => {
  try {
    const pid = req.params.productId;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(400).json({ message: 'No cart' });
    cart.items = cart.items.filter(i => i.product.toString() !== pid);
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/cart/checkout -> create Purchase, clear cart, update counters
router.post('/checkout', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart empty' });

    const items = cart.items.map(i => ({ product: i.product._id, qty: i.qty }));
    const total = cart.items.reduce((s, i) => s + (i.product.price * i.qty), 0);

    const purchase = new Purchase({ buyer: req.user._id, items, total });
    await purchase.save();

    // update buyer record
    await User.findByIdAndUpdate(req.user._id, { $inc: { itemsBought: cart.items.length }, $push: { previousPurchases: purchase._id } });

    // update sellers' itemsSold counter
    for (const it of cart.items) {
      await User.findByIdAndUpdate(it.product.seller, { $inc: { itemsSold: it.qty } });
    }

    // clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: 'Purchase completed', purchase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
