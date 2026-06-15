import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Product from './models/Product.js';
import Category from './models/Category.js';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const categories = await Category.find({});
  console.log("Registered categories:");
  categories.forEach(c => console.log(`- ${c.name} (ID: ${c._id})`));

  const products = await Product.find({}).populate('category');
  console.log("\nRegistered products:");
  products.forEach(p => console.log(`- ${p.name} (Category: ${p.category?.name || 'none'}) (Price: ${p.price})`));

  process.exit();
}).catch(err => {
  console.error("DB connection error", err);
  process.exit(1);
});
