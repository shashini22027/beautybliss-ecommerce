import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const subcategory = req.query.subcategory;
  const color = req.query.color;
  const country = req.query.country;

  const keyword = req.query.keyword ? {
    $or: [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } }
    ]
  } : {};

  const query = { ...keyword };
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (color) query.color = color;
  if (country) query.country = country;

  const products = await Product.find(query).populate('category');
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
  const { name, price, image, images, brand, category, subcategory, color, country, countInStock, description } = req.body;
  // Resolve category name to ObjectId if a string is provided
  let categoryId = category;
  if (category && typeof category === 'string' && !mongoose.isValidObjectId(category)) {
    // Case-insensitive lookup by category name
    const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
    if (catDoc) {
      categoryId = catDoc._id;
    } else {
      res.status(400);
      throw new Error(`Category "${category}" not found. Please select a valid category.`);
    }
  }
  // Fallback for image – use first image from images array if none supplied
  const finalImage = image || (Array.isArray(images) && images.length ? images[0] : '');
  const product = new Product({ name, price, image: finalImage, images, brand, category: categoryId, subcategory, color, country, countInStock, description });
  const createdProduct = await product.save();
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
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, images, brand, category, subcategory, color, country, countInStock, description } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    // Resolve category name to ObjectId if a string is provided
    let categoryId = category;
    if (category && typeof category === 'string' && !mongoose.isValidObjectId(category)) {
      const catDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (catDoc) {
        categoryId = catDoc._id;
      } else {
        res.status(400);
        throw new Error(`Category "${category}" not found. Please select a valid category.`);
      }
    }

    product.name = name || product.name;
    product.price = price === undefined ? product.price : price;
    product.image = image || product.image;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = categoryId || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.color = color || product.color;
    product.country = country || product.country;
    product.countInStock = countInStock === undefined ? product.countInStock : countInStock;
    product.description = description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

export { getProducts, getProductById, createProduct, createProductReview, updateProduct, deleteProduct };
