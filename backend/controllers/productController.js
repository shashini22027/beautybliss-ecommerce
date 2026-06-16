import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import { clearCache } from '../middleware/cacheMiddleware.js';

const MAX_STANDARD_IMAGES = 2;
const MAX_LIPSTICK_IMAGES = 5;

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
    rating: rating === undefined || rating === null || rating === '' ? undefined : Number(rating),
  });

  const createdProduct = await product.save();
  await clearCache('/api/products*');
  res.status(201).json(createdProduct);
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    await clearCache('/api/products*');
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
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
