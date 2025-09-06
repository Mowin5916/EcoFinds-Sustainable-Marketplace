const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  username: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  itemsSold: { type: Number, default: 0 },
  itemsBought: { type: Number, default: 0 },
  previousPurchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
