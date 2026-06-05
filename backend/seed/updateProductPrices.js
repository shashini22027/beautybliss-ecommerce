import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const PRICE_MULTIPLIER = 50;
const MAX_UNMULTIPLIED_PRICE = 100;

const updateProductPrices = async () => {
  try {
    await connectDB();

    const result = await Product.updateMany(
      { price: { $gt: 0, $lt: MAX_UNMULTIPLIED_PRICE } },
      [{ $set: { price: { $multiply: ['$price', PRICE_MULTIPLIER] } } }]
    );

    console.log(`Multiplier applied: x${PRICE_MULTIPLIER}`);
    console.log(`Products matched: ${result.matchedCount}`);
    console.log(`Products updated: ${result.modifiedCount}`);
    process.exit(0);
  } catch (error) {
    console.error(`Price update failed: ${error.message}`);
    process.exit(1);
  }
};

updateProductPrices();
