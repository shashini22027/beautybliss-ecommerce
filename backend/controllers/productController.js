const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const category = req.query.category;
  const keyword = req.query.keyword ? {
    name: { $regex: req.query.keyword, $options: 'i' }
  } : {};
  const query = { ...keyword };
  if (category) query.category = category;
  const products = await Product.find(query).populate('category');
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

const createProduct = async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } = req.body;
  const product = new Product({ name, price, image, brand, category, countInStock, description });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

const createProductReview = async (req, res) => {
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
};

module.exports = { getProducts, getProductById, createProduct, createProductReview };
