// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch products sold by this user (return array)
    const soldProducts = await Product.find({ seller: userId })
      .select("_id title description category price image createdAt updatedAt")
      .lean();

    // Ensure previousPurchases is an array
    const previousPurchases = Array.isArray(user.previousPurchases)
      ? user.previousPurchases
      : [];

    return res.json({
      ...user,
      itemsSold: soldProducts || [],
      previousPurchases
    });
  } catch (err) {
    console.error("GET /user/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
