const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const category = req.query.category;
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};

  const query = { ...keyword };
  if (category) {
    query.category = category;
  }

  const products = await Product.find(query).populate('category');
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } = req.body;
  const product = new Product({
    name, price, image, brand, category, countInStock, description, numReviews: 0
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

module.exports = { getProducts, getProductById, createProduct };
