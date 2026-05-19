const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@beautybliss.com',
      password: 'password123',
      isAdmin: true
    });

    const catSkincare = await Category.create({
      name: 'Skincare',
      description: 'Luxury skincare formulations',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'
    });

    const catCosmetics = await Category.create({
      name: 'Cosmetics',
      description: 'Professional color cosmetics',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'
    });

    await Product.create([
      {
        name: 'Glow Boosting Serum',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
        description: 'Enriched with Vitamin C and Hyaluronic Acid for a radiant finish.',
        brand: 'Aura Glow',
        category: catSkincare._id,
        price: 45.0,
        countInStock: 25,
        rating: 4.8,
        numReviews: 12
      },
      {
        name: 'Velvet Lip Stain',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
        description: 'Long-lasting luxury matte tint that stays all day without drying.',
        brand: 'Luxe Color',
        category: catCosmetics._id,
        price: 22.5,
        countInStock: 50,
        rating: 4.5,
        numReviews: 8
      }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
