// seed.js - run with `npm run seed`
// Creates demo users and products for the hackathon.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding');

  // Clear collections
  await User.deleteMany({});
  await Product.deleteMany({});

  // Create users
  const pw = 'Pass@123';
  const salt = await bcrypt.genSalt(10);
  const ph = await bcrypt.hash(pw, salt);

  const anika = new User({ email: 'anika@test.com', passwordHash: ph, username: 'Anika' });
  const mowin = new User({ email: 'mowin@test.com', passwordHash: ph, username: 'Mowin' });
  const buyer = new User({ email: 'buyer@test.com', passwordHash: ph, username: 'Shopper' });

  await anika.save();
  await mowin.save();
  await buyer.save();

  // Create sample products
  const products = [
    {
      title: 'Vintage Wooden Chair',
      description: 'Solid wood, minor scratches. Cozy and timeless.',
      category: 'Furniture',
      price: 1200,
      image: 'https://via.placeholder.com/400x300?text=Wooden+Chair',
      seller: anika._id
    },
    {
      title: 'Used DSLR Camera',
      description: 'Working, lens included. Great for beginners.',
      category: 'Electronics',
      price: 8000,
      image: 'https://via.placeholder.com/400x300?text=DSLR+Camera',
      seller: mowin._id
    },
    {
      title: 'Denim Jacket (Size M)',
      description: 'Good condition, classic style.',
      category: 'Clothes',
      price: 700,
      image: 'https://via.placeholder.com/400x300?text=Denim+Jacket',
      seller: anika._id
    },
    {
      title: 'Set of 3 Sci-Fi Books',
      description: 'Lightly used, all volumes included.',
      category: 'Books',
      price: 300,
      image: 'https://via.placeholder.com/400x300?text=Books',
      seller: mowin._id
    }
  ];

  for (const p of products) {
    const doc = new Product(p);
    await doc.save();
    console.log('Created product:', doc.title);
  }

  console.log('Seeding complete. Users created: anika@test.com, mowin@test.com, buyer@test.com (password: Pass@123)');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
