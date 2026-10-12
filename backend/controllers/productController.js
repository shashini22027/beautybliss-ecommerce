import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import fs from 'fs';
import { clearCache } from '../middleware/cacheMiddleware.js';

const MAX_STANDARD_IMAGES = 2;
const MAX_LIPSTICK_IMAGES = 5;

const removeReviewUploads = async (files = []) => {
  await Promise.all(files.map((file) => fs.promises.unlink(file.path)));
};

const normalizeImageValues = (image, images) => {
  const values = [];

  const pushValue = (value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        values.push(trimmed);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(pushValue);
      return;
    }

    if (value && typeof value === 'object' && typeof value.url === 'string') {
      pushValue(value.url);
    }
  };

  pushValue(image);
  pushValue(images);

  return [...new Set(values)];
};

const MULTI_COLOR_KEYWORDS = ['lipstick', 'mascara', 'foundation'];

const isColorVariantProduct = ({ name, subcategory, categoryName }) => {
  const haystack = [name, subcategory, categoryName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return MULTI_COLOR_KEYWORDS.some((kw) => haystack.includes(kw));
};

const resolveCategoryId = async (category) => {
  if (!category) {
    return { categoryId: category, categoryDoc: null };
  }

  if (typeof category === 'string' && !mongoose.isValidObjectId(category)) {
    const categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${category}$`, 'i') },
    });

    if (!categoryDoc) {
      throw new Error(`Category "${category}" not found. Please select a valid category.`);
    }

    return { categoryId: categoryDoc._id, categoryDoc };
  }

  const categoryDoc = await Category.findById(category);
  return { categoryId: category, categoryDoc };
};

const getAllowedImageCount = (productInfo) =>
  isColorVariantProduct(productInfo) ? MAX_LIPSTICK_IMAGES : MAX_STANDARD_IMAGES;

const normalizeVariants = (variants) => {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants
    .map((variant) => ({
      name: typeof variant?.name === 'string' ? variant.name.trim() : '',
      hex: typeof variant?.hex === 'string' ? variant.hex.trim() : '',
      image: typeof variant?.image === 'string' ? variant.image.trim() : '',
      countInStock:
        variant?.countInStock === undefined || variant?.countInStock === null || variant?.countInStock === ''
          ? 0
          : Number(variant.countInStock),
    }))
    .filter((variant) => variant.name);
};

const sumVariantStock = (variants) =>
  variants.reduce((total, variant) => total + (Number.isFinite(variant.countInStock) ? variant.countInStock : 0), 0);

const isSpecialOffersCategory = (category) =>
  category?.name?.trim().toLowerCase() === 'special offers';

const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const subcategory = req.query.subcategory;
  const color = req.query.color;
  const country = req.query.country;
  const section = req.query.section;
  const limit = Number(req.query.limit);

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const query = { ...keyword };
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (color) query.color = color;
  if (country) query.country = country;
  if (section === 'bestSeller') query.isBestSeller = true;
  if (section === 'newArrival') query.isNewArrival = true;
  if (section === 'hotDeal') query.isHotDeal = true;

  let productQuery = Product.find(query).populate('category');

  if (section === 'bestSeller') {
    productQuery = productQuery.sort({ rating: -1, createdAt: -1 });
  } else if (section === 'newArrival') {
    productQuery = productQuery.sort({ createdAt: -1 });
  } else if (section === 'hotDeal') {
    productQuery = productQuery.sort({ compareAtPrice: -1, createdAt: -1 });
  }

  if (!Number.isNaN(limit) && limit > 0) {
    productQuery = productQuery.limit(limit);
  }

  const products = await productQuery;
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    images,
    brand,
    category,
    subcategory,
    color,
    country,
    countInStock,
    description,
    compareAtPrice,
    discountLabel,
    isBestSeller,
    isNewArrival,
    isHotDeal,
    isSpecialOffer,
    rating,
    variants,
  } = req.body;

  let categoryId;
  let categoryDoc = null;

  try {
    ({ categoryId, categoryDoc } = await resolveCategoryId(category));
  } catch (err) {
    res.status(400);
    throw err;
  }

  const productInfo = {
    name,
    subcategory,
    categoryName: categoryDoc?.name,
  };
  const normalizedVariants = normalizeVariants(variants);
  const isVariantProduct = isColorVariantProduct(productInfo);

  if (isVariantProduct && normalizedVariants.length === 0) {
    res.status(400);
    throw new Error('Please add at least one color variant with stock for this product.');
  }

  const finalImages = normalizeImageValues(image, images);
  const allowedImageCount = getAllowedImageCount(productInfo);

  if (finalImages.length > allowedImageCount) {
    res.status(400);
    throw new Error(
      `This product can have at most ${allowedImageCount} image${allowedImageCount === 1 ? '' : 's'}.`
    );
  }

  const resolvedCountInStock = isVariantProduct
    ? sumVariantStock(normalizedVariants)
    : countInStock;

  const product = new Product({
    name,
    price,
    image: finalImages[0] || '',
    images: finalImages,
    brand,
    category: categoryId,
    subcategory,
    color,
    country,
    variants: isVariantProduct ? normalizedVariants : [],
    countInStock: resolvedCountInStock,
    description,
    compareAtPrice,
    discountLabel,
    isBestSeller,
    isNewArrival,
    isHotDeal,
    isSpecialOffer: Boolean(isSpecialOffer) || isSpecialOffersCategory(categoryDoc),
    rating: rating === undefined || rating === null || rating === '' ? undefined : Number(rating),
  });

  const createdProduct = await product.save();
  await clearCache('/api/products*');
  res.status(201).json(createdProduct);
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, name, email } = req.body || {};
  const product = await Product.findById(req.params.id);

  if (!product) {
    await removeReviewUploads(req.files);
    return res.status(404).json({ message: 'Product not found' });
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const reviewerName = String(req.user?.name || name || '').trim();
  const reviewComment = String(comment || '').trim();
  const reviewRating = Number(rating);

  if (!reviewerName || reviewerName.length > 100) {
    await removeReviewUploads(req.files);
    return res.status(400).json({ message: 'Enter your name (up to 100 characters).' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
    await removeReviewUploads(req.files);
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }
  if (!Number.isInteger(reviewRating) || reviewRating < 1 || reviewRating > 5) {
    await removeReviewUploads(req.files);
    return res.status(400).json({ message: 'Choose a rating from 1 to 5 stars.' });
  }
  if (!reviewComment || reviewComment.length > 5000) {
    await removeReviewUploads(req.files);
    return res.status(400).json({ message: 'Write a review (up to 5000 characters).' });
  }

  const alreadyReviewed = product.reviews.find((review) =>
    review.email?.toLowerCase() === normalizedEmail ||
    (req.user && review.user?.toString() === req.user._id.toString())
  );
  if (alreadyReviewed) {
    await removeReviewUploads(req.files);
    return res.status(400).json({ message: 'This email has already reviewed this product.' });
  }

  const media = (req.files || []).map((file) => ({
    url: `/uploads/reviews/${file.filename}`,
    type: file.mimetype.startsWith('video/') ? 'video' : 'image',
  }));
  product.reviews.push({
    name: reviewerName,
    email: normalizedEmail,
    rating: reviewRating,
    comment: reviewComment,
    user: req.user?._id,
    media,
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((total, review) => review.rating + total, 0) /
    product.reviews.length;

  try {
    await product.save();
  } catch (error) {
    await removeReviewUploads(req.files);
    throw error;
  }
  await clearCache('/api/products*');
  return res.status(201).json({ message: 'Review added', reviews: product.reviews });
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    images,
    brand,
    category,
    subcategory,
    color,
    country,
    countInStock,
    description,
    compareAtPrice,
    discountLabel,
    isBestSeller,
    isNewArrival,
    isHotDeal,
    isSpecialOffer,
    rating,
    variants,
  } = req.body;

  const product = await Product.findById(req.params.id).populate('category');

  if (product) {
    let categoryId;
    let categoryDoc = product.category || null;

    try {
      ({ categoryId, categoryDoc } = await resolveCategoryId(category));
    } catch (err) {
      res.status(400);
      throw err;
    }

    const productInfo = {
      name: name || product.name,
      subcategory: subcategory || product.subcategory,
      categoryName: categoryDoc?.name || product.category?.name,
    };
    const isVariantProduct = isColorVariantProduct(productInfo);
    const normalizedVariants =
      variants !== undefined ? normalizeVariants(variants) : product.variants || [];

    if (isVariantProduct && variants !== undefined && normalizedVariants.length === 0) {
      res.status(400);
      throw new Error('Please add at least one color variant with stock for this product.');
    }

    const submittedImages = normalizeImageValues(image, images);
    const nextImages = submittedImages.length
      ? submittedImages
      : normalizeImageValues(product.image, product.images);
    const allowedImageCount = getAllowedImageCount(productInfo);

    if (nextImages.length > allowedImageCount) {
      res.status(400);
      throw new Error(
        `This product can have at most ${allowedImageCount} image${allowedImageCount === 1 ? '' : 's'}.`
      );
    }

    product.name = name || product.name;
    product.price = price === undefined ? product.price : price;
    product.image = nextImages[0] || product.image;
    product.images = nextImages;
    product.brand = brand || product.brand;
    product.category = categoryId || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.color = color || product.color;
    product.country = country || product.country;

    if (isVariantProduct) {
      product.variants = normalizedVariants;
      product.countInStock = sumVariantStock(normalizedVariants);
    } else {
      product.variants = [];
      product.countInStock = countInStock === undefined ? product.countInStock : countInStock;
    }
    product.description = description || product.description;
    product.compareAtPrice =
      compareAtPrice === undefined ? product.compareAtPrice : compareAtPrice;
    product.discountLabel = discountLabel === undefined ? product.discountLabel : discountLabel;
    product.isBestSeller = isBestSeller === undefined ? product.isBestSeller : isBestSeller;
    product.isNewArrival = isNewArrival === undefined ? product.isNewArrival : isNewArrival;
    product.isHotDeal = isHotDeal === undefined ? product.isHotDeal : isHotDeal;
    product.isSpecialOffer =
      Boolean(isSpecialOffer ?? product.isSpecialOffer) || isSpecialOffersCategory(categoryDoc);
    product.rating =
      rating === undefined || rating === null || rating === '' ? product.rating : Number(rating);

    const updatedProduct = await product.save();
    await clearCache('/api/products*');
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    await clearCache('/api/products*');
    res.json({ message: 'Product removed successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  createProductReview,
  updateProduct,
  deleteProduct,
};
