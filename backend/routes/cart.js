// routes/cart.js
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// GET /api/cart  -> populate items.product
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      model: "Product",
      populate: { path: "seller", select: "username profileImage" }
    }).lean();

    if (!cart) {
      return res.json({ items: [] });
    }

    return res.json(cart);
  } catch (err) {
    console.error("GET /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cart  -> body { productId }
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existing = cart.items.find((it) => it.product.toString() === productId.toString());
    if (existing) {
      existing.qty = existing.qty + 1;
    } else {
      cart.items.push({ product: productId, qty: 1 });
    }

    await cart.save();

    // respond populated
    cart = await Cart.findById(cart._id).populate({
      path: "items.product",
      model: "Product",
      populate: { path: "seller", select: "username profileImage" }
    }).lean();

    return res.json(cart);
  } catch (err) {
    console.error("POST /cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
