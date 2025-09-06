const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
