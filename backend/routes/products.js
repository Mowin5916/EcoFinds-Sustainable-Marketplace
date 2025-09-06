// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

function isDirectImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return lower.endsWith(".jpg") ||
         lower.endsWith(".jpeg") ||
         lower.endsWith(".png") ||
         lower.endsWith(".webp") ||
         lower.endsWith(".gif");
}

// GET /api/products?q=&category=
router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";
    const category = req.query.category || "";
    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    let products = await Product.find(filter)
      .populate("seller", "username profileImage")
      .sort({ createdAt: -1 })
      .lean();

    const placeholder = "https://via.placeholder.com/400x300?text=No+Image";
    products = products.map((p) => {
      if (!isDirectImageUrl(p.image)) p.image = placeholder;
      if (!p.eco) p.eco = { co2Saved: 0, waterSaved: 0 };
      return p;
    });

    return res.json({ products });
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products (auth required)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, category, price, image } = req.body;
    if (!title || !category || !price) {
      return res.status(400).json({ message: "title, category, price required" });
    }

    const newProduct = new Product({
      title,
      description: description || "",
      category,
      price,
      image: image || "https://via.placeholder.com/400x300?text=No+Image",
      seller: req.userId,
      eco: { co2Saved: 0, waterSaved: 0 }
    });

    await newProduct.save();
    const populated = await Product.findById(newProduct._id).populate("seller", "username profileImage").lean();
    return res.status(201).json(populated);
  } catch (err) {
    console.error("POST /products error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
