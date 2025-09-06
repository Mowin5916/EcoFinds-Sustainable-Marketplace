// update-images.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI;

const updates = {
  "One Plus 11R": "https://oasis.opstatics.com/content/dam/oasis/page/2023/in/oneplus-10t/specs/10r-blue.png",
  "Set of 3 Sci-Fi Books": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGPcKL-qKiA_o6hcMkyBUl37kyQG6cI9b19Q&s",
  "Denim Jacket (Size M)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSopDkyTPATDKF6u3J0DlOYwHNzmvkHqIfXVg&s",
  "Used DSLR Camera": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LhYiXBPAD6n1ofi9K1mY5qOrHqbzUxus5Q&s",
  "Vintage Wooden Chair": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_LhYiXBPAD6n1ofi9K1mY5qOrHqbzUxus5Q&s"
};

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to Mongo");

  for (const [title, url] of Object.entries(updates)) {
    const res = await Product.findOneAndUpdate(
      { title },
      { $set: { image: url } },
      { new: true }
    ).lean();
    if (res) console.log("Updated:", title);
    else console.log("Not found:", title);
  }

  await mongoose.disconnect();
  console.log("Done");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});