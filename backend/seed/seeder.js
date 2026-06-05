import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();

    await Coupon.create([
      {
        code: 'BEAUTY10',
        discountType: 'percentage',
        discountAmount: 10,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'BLISS20',
        discountType: 'percentage',
        discountAmount: 20,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        code: 'SAVE5',
        discountType: 'fixed',
        discountAmount: 5,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ]);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@beautybliss.com',
      password: 'password123',
      isAdmin: true
    });

    const catSkincare = await Category.create({
      name: 'Skincare',
      description: 'Luxury skincare formulations for radiant, healthy skin',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'
    });

    const catCosmetics = await Category.create({
      name: 'Cosmetics',
      description: 'Professional color cosmetics for perfect touchups',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'
    });

    const catHaircare = await Category.create({
      name: 'Haircare',
      description: 'Nourishing oils, shampoos, and deep conditioning treatments',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80'
    });

    const catFragrance = await Category.create({
      name: 'Fragrances',
      description: 'Exquisite, long-lasting floral and woody luxury perfumes',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80'
    });

    await Product.create([
      // Skincare Products
      {
        name: 'Glow Boosting Serum',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&q=80',
          'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80'
        ],
        description: 'Enriched with Vitamin C and Hyaluronic Acid for a radiant, youthful finish.',
        brand: 'Aura Glow',
        category: catSkincare._id,
        subcategory: 'Serum',
        country: 'Korean',
        price: 1550,
        countInStock: 25,
        rating: 5.0,
        numReviews: 1,
        reviews: [
          {
            name: 'Aria Song',
            rating: 5,
            comment: 'My skin has never glowed like this before. Pure magic!',
            user: adminUser._id
          }
        ]
      },
      {
        name: 'Hyaluronic Hydration Cream',
        image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'
        ],
        description: 'Intense 24-hour hydration barrier boost cream with ceramides and marine extracts.',
        brand: 'HydroPure',
        category: catSkincare._id,
        subcategory: 'Cream',
        country: 'USA',
        price: 885,
        countInStock: 15,
        rating: 4.7,
        numReviews: 0,
        reviews: []
      },
      {
        name: 'Retinol Renew Night Serum',
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
        images: [],
        description: 'Advanced 0.5% pure clinical retinol serum that targets fine lines and hyperpigmentation.',
        brand: 'Dermalift',
        category: catSkincare._id,
        subcategory: 'Serum',
        country: 'Korean',
        price: 595,
        countInStock: 10,
        rating: 4.9,
        numReviews: 0,
        reviews: []
      },
      {
        name: 'Mineral Shield SPF 50+',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80',
        images: [],
        description: 'Ultra-lightweight zinc oxide mineral sunscreen with no white cast and a dewy glow.',
        brand: 'Solis',
        category: catSkincare._id,
        subcategory: 'Sunscreen',
        country: 'Japan',
        price: 840,
        countInStock: 30,
        rating: 4.6,
        numReviews: 0,
        reviews: []
      },

      // Cosmetics Products
      {
        name: 'Velvet Lip Stain',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=500&q=80',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80'
        ],
        description: 'Long-lasting luxury matte tint that stays all day without drying the lips.',
        brand: 'Luxe Color',
        category: catCosmetics._id,
        subcategory: 'Lipstick',
        color: 'Red',
        country: 'Korean',
        price: 795,
        countInStock: 50,
        rating: 4.5,
        numReviews: 2,
        reviews: [
          {
            name: 'Chloe Kim',
            rating: 5,
            comment: 'Gorgeous velvet texture! The red shade is extremely pigmented and lasts all day.',
            user: adminUser._id
          },
          {
            name: 'Sarah Miller',
            rating: 4,
            comment: 'Very moisturizing but still matte. Highly recommend the shade.',
            user: adminUser._id
          }
        ]
      },
      {
        name: 'Perfect Canvas Foundation',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
        images: [],
        description: 'Medium to full coverage buildable foundation with soft matte oil-control technology.',
        brand: 'BaseGlow',
        category: catCosmetics._id,
        subcategory: 'Foundation',
        country: 'USA',
        price: 960,
        countInStock: 20,
        rating: 4.4,
        numReviews: 0,
        reviews: []
      },
      {
        name: 'Infinity Length Mascara',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
        images: [],
        description: 'Clump-free, volumizing, waterproof silk fiber mascara for extreme lash length.',
        brand: 'LashLift',
        category: catCosmetics._id,
        subcategory: 'Mascara',
        country: 'Korean',
        price: 565,
        countInStock: 40,
        rating: 4.7,
        numReviews: 0,
        reviews: []
      },
      {
        name: 'Sunset Glow Blush Palette',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
        images: [],
        description: 'Four highly pigmented, blendable powder blushes spanning coral, peach, and soft rose.',
        brand: 'Luxe Color',
        category: catCosmetics._id,
        subcategory: 'Blush',
        color: 'Peach',
        country: 'French',
        price: 735,
        countInStock: 12,
        rating: 4.6,
        numReviews: 0,
        reviews: []
      },

      // Haircare Products
      {
        name: 'Argan Oil Restoring Shampoo',
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
        images: [],
        description: 'Deeply nourishing Moroccan argan oil shampoo that restores shine and strengthens roots.',
        brand: 'SilkySleek',
        category: catHaircare._id,
        subcategory: 'Shampoo',
        country: 'USA',
        price: 660,
        countInStock: 35,
        rating: 4.8,
        numReviews: 0,
        reviews: []
      },
      {
        name: 'Keratin Deep Repair Mask',
        image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80',
        images: [],
        description: 'Intense damage-reversing conditioning treatment mask for frizzy or color-treated hair.',
        brand: 'SilkySleek',
        category: catHaircare._id,
        subcategory: 'Conditioner',
        country: 'Japan',
        price: 825,
        countInStock: 18,
        rating: 4.9,
        numReviews: 0,
        reviews: []
      },

      // Fragrance Products
      {
        name: 'Jasmine Nectar Eau De Parfum',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80',
        images: [],
        description: 'Luxury scent blending fresh white jasmine petals, sandalwood, and sweet citrus nectar.',
        brand: 'Aroma Bliss',
        category: catFragrance._id,
        subcategory: 'Perfume',
        country: 'French',
        price: 1350,
        countInStock: 8,
        rating: 5.0,
        numReviews: 0,
        reviews: []
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
