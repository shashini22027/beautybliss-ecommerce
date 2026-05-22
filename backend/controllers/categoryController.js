import asyncHandler from '../utils/asyncHandler.js';
import Category from '../models/Category.js';

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const category = new Category({ name, description, image });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

export { getCategories, createCategory };
