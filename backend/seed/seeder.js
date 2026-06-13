import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

// Verified Unsplash Beauty Images
const IMAGES = {
  cleanserPrimary: '/assets/images/skincare/cleansers/cleansers_image1.1.jpg',
  cleanserSecondary: '/assets/images/skincare/cleansers/cleansers_image1.2.jpg',
  toner: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
  cream: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&q=80',
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
  tube: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80',
  lipstick: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
  foundation: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
  eye: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
  palette: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
  shampoo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
  hairMask: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80',
  oil: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80',
  perfume: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80',
  bodyMist: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80',
  brushes: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80'
};

const catalog = {
  'Skincare': {
    desc: 'Luxury skincare formulations for radiant, healthy skin',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    subcategories: {
      'Cleansers': [
        { name: 'Ultimate Cleanser', img: IMAGES.cleanserPrimary, secondaryImg: IMAGES.cleanserSecondary }
      ],
      'Toners': [
        { name: 'Hydrating Toner', img: IMAGES.toner },
        { name: 'Brightening Toner', img: IMAGES.toner },
        { name: 'Exfoliating Toner', img: IMAGES.toner }
      ],
      'Moisturizers': [
        { name: 'Day Cream', img: IMAGES.cream },
        { name: 'Night Cream', img: IMAGES.cream },
        { name: 'Gel Moisturizer', img: IMAGES.cream }
      ],
      'Serums': [
        { name: 'Vitamin C Serum', img: IMAGES.serum },
        { name: 'Hyaluronic Acid Serum', img: IMAGES.serum },
        { name: 'Retinol Serum', img: IMAGES.serum }
      ],
      'Sunscreens': [
        { name: 'SPF 30 Sunscreen', img: IMAGES.tube },
        { name: 'SPF 50 Sunscreen', img: IMAGES.tube },
        { name: 'Tinted Sunscreen', img: IMAGES.tube }
      ]
    }
  },
  'Haircare': {
    desc: 'Nourishing treatments for healthy, shiny hair',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
    subcategories: {
      'Shampoo': [
        { name: 'Anti-Dandruff Shampoo', img: IMAGES.shampoo },
        { name: 'Repair Shampoo', img: IMAGES.shampoo },
        { name: 'Color Protection Shampoo', img: IMAGES.shampoo }
      ],
      'Conditioner': [
        { name: 'Moisturizing Conditioner', img: IMAGES.shampoo },
        { name: 'Smoothening Conditioner', img: IMAGES.shampoo },
        { name: 'Volumizing Conditioner', img: IMAGES.shampoo }
      ],
      'Hair Masks': [
        { name: 'Keratin Mask', img: IMAGES.hairMask },
        { name: 'Repair Mask', img: IMAGES.hairMask },
        { name: 'Hydrating Mask', img: IMAGES.hairMask }
      ],
      'Hair Oils': [
        { name: 'Coconut Hair Oil', img: IMAGES.oil },
        { name: 'Argan Hair Oil', img: IMAGES.oil },
        { name: 'Castor Hair Oil', img: IMAGES.oil }
      ]
    }
  },
  'Makeup': {
    desc: 'Professional cosmetics for flawless looks',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80',
    subcategories: {
      'Foundation': [
        { name: 'Ivory Foundation', img: IMAGES.foundation, color: 'Ivory' },
        { name: 'Beige Foundation', img: IMAGES.foundation, color: 'Beige' },
        { name: 'Sand Foundation', img: IMAGES.foundation, color: 'Sand' },
        { name: 'Honey Foundation', img: IMAGES.foundation, color: 'Honey' },
        { name: 'Caramel Foundation', img: IMAGES.foundation, color: 'Caramel' }
      ],
      'Lipstick': [
        { name: 'Red Lipstick', img: IMAGES.lipstick, color: 'Red' },
        { name: 'Pink Lipstick', img: IMAGES.lipstick, color: 'Pink' },
        { name: 'Nude Lipstick', img: IMAGES.lipstick, color: 'Nude' },
        { name: 'Orange Lipstick', img: IMAGES.lipstick, color: 'Orange' },
        { name: 'Brown Lipstick', img: IMAGES.lipstick, color: 'Brown' },
        { name: 'Purple Lipstick', img: IMAGES.lipstick, color: 'Purple' },
        { name: 'Coral Lipstick', img: IMAGES.lipstick, color: 'Coral' },
        { name: 'Burgundy Lipstick', img: IMAGES.lipstick, color: 'Burgundy' }
      ],
      'Mascara': [
        { name: 'Black Mascara', img: IMAGES.eye },
        { name: 'Brown Mascara', img: IMAGES.eye },
        { name: 'Waterproof Mascara', img: IMAGES.eye },
        { name: 'Volume Boost Mascara', img: IMAGES.eye }
      ],
      'Eyeshadow': [
        { name: 'Nude Palette', img: IMAGES.palette },
        { name: 'Pink Palette', img: IMAGES.palette },
        { name: 'Smokey Palette', img: IMAGES.palette },
        { name: 'Glitter Palette', img: IMAGES.palette }
      ]
    }
  },
  'Fragrances': {
    desc: 'Exquisite, long-lasting luxury perfumes',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80',
    subcategories: {
      'Perfumes': [
        {
          name: 'BeautyBliss Floral Bloom Perfume',
          img: IMAGES.perfume,
          description: 'Immerse yourself in a blooming paradise with this enchanting eau de parfum. Featuring a sophisticated blend of fresh jasmine, delicate white rose, and a subtle touch of warm musk, it delivers a captivating, romantic, and long-lasting scent trail perfect for the modern, elegant woman.',
          price: 13200,
          compareAtPrice: 16500,
          discountLabel: '20% OFF',
          rating: 4.9,
          countInStock: 24,
          brand: 'BeautyBliss',
          isBestSeller: true,
          isNewArrival: true,
          isHotDeal: true
        },
        { name: 'Floral Perfume', img: IMAGES.perfume },
        { name: 'Fruity Perfume', img: IMAGES.perfume },
        { name: 'Woody Perfume', img: IMAGES.perfume },
        { name: 'Oriental Perfume', img: IMAGES.perfume }
      ],
      'Body Mist': [
        { name: 'Rose Body Mist', img: IMAGES.bodyMist },
        { name: 'Vanilla Body Mist', img: IMAGES.bodyMist },
        { name: 'Lavender Body Mist', img: IMAGES.bodyMist },
        { name: 'Coconut Body Mist', img: IMAGES.bodyMist }
      ],
      'Deodorants': [
        { name: 'Fresh Deodorant', img: IMAGES.tube },
        { name: 'Floral Deodorant', img: IMAGES.tube },
        { name: 'Sport Deodorant', img: IMAGES.tube },
        { name: 'Sensitive Deodorant', img: IMAGES.tube }
      ]
    }
  },
  'Bath & Body': {
    desc: 'Soothing essentials for bath and body care',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&q=80',
    subcategories: {
      'Body Wash': [
        { name: 'Rose Body Wash', img: IMAGES.cleanser },
        { name: 'Aloe Vera Body Wash', img: IMAGES.cleanser },
        { name: 'Coconut Body Wash', img: IMAGES.cleanser }
      ],
      'Body Lotion': [
        { name: 'Shea Butter Lotion', img: IMAGES.cream },
        { name: 'Cocoa Butter Lotion', img: IMAGES.cream },
        { name: 'Vitamin E Lotion', img: IMAGES.tube }
      ],
      'Scrubs': [
        { name: 'Coffee Scrub', img: IMAGES.cream },
        { name: 'Sugar Scrub', img: IMAGES.cream },
        { name: 'Salt Scrub', img: IMAGES.cream }
      ]
    }
  },
  'Beauty Tools': {
    desc: 'Essential accessories and tools for beauty routines',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
    subcategories: {
      'Makeup Brushes': [
        { name: 'Foundation Brush', img: IMAGES.brushes },
        { name: 'Powder Brush', img: IMAGES.brushes },
        { name: 'Blush Brush', img: IMAGES.brushes }
      ],
      'Sponges': [
        { name: 'Beauty Blender', img: IMAGES.brushes },
        { name: 'Mini Sponge', img: IMAGES.brushes }
      ],
      'Facial Rollers': [
        { name: 'Jade Roller', img: IMAGES.brushes },
        { name: 'Rose Quartz Roller', img: IMAGES.brushes }
      ]
    }
  }
};

const seedData = async () => {
  // Ensure DB connection is established
  await connectDB();
  try {
    await User.deleteMany();
    await Product.deleteMany({ subcategory: 'Cleansers' });
    await Category.deleteMany();
    await Coupon.deleteMany();

    await Coupon.create([
      { code: 'BEAUTY10', discountType: 'percentage', discountAmount: 10, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'BLISS20', discountType: 'percentage', discountAmount: 20, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: 'SAVE5', discountType: 'fixed', discountAmount: 5, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true }
    ]);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@beautybliss.com',
      password: 'password123',
      isAdmin: true
    });

    const productsToInsert = [];
    let productIndex = 0;

    // Loop through catalog and construct items
    for (const [catName, catData] of Object.entries(catalog)) {
      const categoryDoc = await Category.create({
        name: catName,
        description: catData.desc,
        image: catData.image
      });

      for (const [subCatName, products] of Object.entries(catData.subcategories)) {
        for (const prod of products) {
          const isBestSeller = productIndex < 8;
          const isNewArrival = productIndex >= 8 && productIndex < 16;
          const isHotDeal = productIndex >= 16 && productIndex < 24;
          const price = prod.price ?? (Math.floor(Math.random() * 1500) + 500); // Random price between 500-2000
          const compareAtPrice =
            prod.compareAtPrice ?? (isHotDeal ? Math.round(price * 1.25) : null);
          const countInStock =
            prod.countInStock ?? (Math.floor(Math.random() * 50) + 10); // Random stock 10-60
          const rating = prod.rating ?? (Math.random() * 1 + 4).toFixed(1); // Random rating 4.0 - 5.0

          productsToInsert.push({
            name: prod.name,
            image: prod.img,
            images: [prod.img, prod.secondaryImg].filter(Boolean),
            brand: prod.brand || 'BeautyBliss Signature',
            category: categoryDoc._id,
            subcategory: subCatName,
            color: prod.color || '',
            country: prod.country || 'USA',
            price,
            compareAtPrice,
            discountLabel: prod.discountLabel ?? (isNewArrival ? 'New' : isHotDeal ? '-20%' : ''),
            isBestSeller: prod.isBestSeller ?? isBestSeller,
            isNewArrival: prod.isNewArrival ?? isNewArrival,
            isHotDeal: prod.isHotDeal ?? isHotDeal,
            countInStock,
            rating,
            numReviews: Math.floor(Math.random() * 50),
            description: prod.description || `${prod.name} is a BeautyBliss ${subCatName.toLowerCase()} crafted for everyday luxury.`,
            reviews: []
          });

          productIndex += 1;
        }
      }
    }

    await Product.create(productsToInsert);

    console.log(`Successfully seeded ${productsToInsert.length} products across ${Object.keys(catalog).length} categories!`);
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
