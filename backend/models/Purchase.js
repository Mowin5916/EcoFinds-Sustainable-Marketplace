const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: { type: Number, default: 1 }
  }],
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
