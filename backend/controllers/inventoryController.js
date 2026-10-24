import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

const lowStockFilter = {
  $expr: { $lte: ['$countInStock', { $ifNull: ['$lowStockThreshold', 5] }] },
};

export const getInventory = asyncHandler(async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Inventory is temporarily unavailable because the database is disconnected.' });
  }

  const [products, movements, lowStockCount] = await Promise.all([
    Product.find({}).select('name image countInStock lowStockThreshold variants').sort({ name: 1 }).lean(),
    StockMovement.find({}).populate('actor', 'name email').sort({ createdAt: -1 }).limit(100).lean(),
    Product.countDocuments(lowStockFilter),
  ]);

  res.json({ products, movements, lowStockCount });
});

export const adjustInventory = asyncHandler(async (req, res) => {
  const { productId, variantId, quantityChange, reason } = req.body || {};
  const change = Number(quantityChange);
  const cleanReason = typeof reason === 'string' ? reason.trim() : '';
  if (!mongoose.isValidObjectId(productId) || !Number.isInteger(change) || change === 0 || Math.abs(change) > 100000) {
    return res.status(400).json({ message: 'Choose a valid product and a non-zero whole-number stock adjustment.' });
  }
  if (cleanReason.length < 3 || cleanReason.length > 200) {
    return res.status(400).json({ message: 'Enter an adjustment reason between 3 and 200 characters.' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  if (product.variants.length > 0 && !variantId) {
    return res.status(400).json({ message: 'Choose a shade variant when adjusting stock for a variant product.' });
  }

  let variant = null;
  let previousQuantity;
  let updated;
  if (variantId) {
    if (!mongoose.isValidObjectId(variantId)) return res.status(400).json({ message: 'Choose a valid product variant.' });
    variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: 'Product variant not found.' });
    previousQuantity = Number(variant.countInStock) || 0;
    if (previousQuantity + change < 0) return res.status(409).json({ message: 'Stock cannot be adjusted below zero.' });
    updated = await Product.findOneAndUpdate(
      { _id: product._id, variants: { $elemMatch: { _id: variant._id, countInStock: previousQuantity } } },
      { $inc: { 'variants.$.countInStock': change, countInStock: change } },
      { new: true }
    );
  } else {
    previousQuantity = Number(product.countInStock) || 0;
    if (previousQuantity + change < 0) return res.status(409).json({ message: 'Stock cannot be adjusted below zero.' });
    updated = await Product.findOneAndUpdate(
      { _id: product._id, countInStock: previousQuantity },
      { $inc: { countInStock: change } },
      { new: true }
    );
  }
  if (!updated) return res.status(409).json({ message: 'Stock changed while saving. Refresh inventory and try again.' });

  try {
    await StockMovement.create({
      product: product._id,
      productName: product.name,
      variantId: variant?._id || null,
      variantName: variant?.name || '',
      type: 'adjustment',
      quantityChange: change,
      reason: cleanReason,
      actor: req.user._id,
    });
  } catch (error) {
    if (variant) {
      await Product.updateOne({ _id: product._id, variants: { $elemMatch: { _id: variant._id } } }, { $inc: { 'variants.$.countInStock': -change, countInStock: -change } });
    } else {
      await Product.updateOne({ _id: product._id }, { $inc: { countInStock: -change } });
    }
    throw error;
  }
  await clearCache('/api/products*');

  return res.status(201).json({ message: 'Inventory adjusted and recorded.', product: updated });
});

export const updateLowStockThreshold = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId)) return res.status(400).json({ message: 'Invalid product ID.' });
  const threshold = Number(req.body?.threshold);
  if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100000) {
    return res.status(400).json({ message: 'Low-stock threshold must be a whole number from 0 to 100,000.' });
  }
  const product = await Product.findByIdAndUpdate(req.params.productId, { lowStockThreshold: threshold }, { new: true, runValidators: true })
    .select('name countInStock lowStockThreshold');
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  await clearCache('/api/products*');
  return res.json(product);
});
