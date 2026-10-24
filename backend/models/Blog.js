import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Skincare', 'Makeup', 'Ingredients', 'Tutorials', 'Beauty'],
      default: 'Beauty',
    },
    author: {
      type: String,
      trim: true,
      default: 'BeautyBliss Editorial',
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
