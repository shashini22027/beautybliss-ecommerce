const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  const category = new Category({ name, description, image });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

module.exports = { getCategories, createCategory };
