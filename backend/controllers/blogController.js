import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import BlogComment from '../models/BlogComment.js';

const findBlogBySlugOrId = (identifier) => {
  const conditions = [{ slug: identifier }];

  if (mongoose.isValidObjectId(identifier)) {
    conditions.push({ _id: identifier });
  }

  return Blog.findOne({ $or: conditions });
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const [blogs, commentCounts] = await Promise.all([
    Blog.find({}).sort({ date: -1, createdAt: -1 }).lean(),
    BlogComment.aggregate([
      { $group: { _id: '$blog', count: { $sum: 1 } } },
    ]),
  ]);
  const countsByBlogId = new Map(
    commentCounts.map(({ _id, count }) => [String(_id), count])
  );

  res.json(
    blogs.map((blog) => ({
      ...blog,
      commentCount: countsByBlogId.get(String(blog._id)) || 0,
    }))
  );
});

// @desc    Get comments for a blog
// @route   GET /api/blogs/:slug/comments
// @access  Public
const getBlogComments = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlugOrId(req.params.slug).select('_id');
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const [comments, totalCount] = await Promise.all([
    BlogComment.find({ blog: blog._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('name comment createdAt')
      .lean(),
    BlogComment.countDocuments({ blog: blog._id }),
  ]);

  res.json({ comments: comments.reverse(), totalCount });
});

// @desc    Add a comment to a blog
// @route   POST /api/blogs/:slug/comments
// @access  Public
const createBlogComment = asyncHandler(async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const comment =
    typeof req.body?.comment === 'string' ? req.body.comment.trim() : '';

  if (!name || !comment) {
    res.status(400);
    throw new Error('Name and comment are required');
  }

  if (name.length > 60 || comment.length > 1000) {
    res.status(400);
    throw new Error('Name must be 60 characters or less and comment 1,000 characters or less');
  }

  const blog = await findBlogBySlugOrId(req.params.slug).select('_id');
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const savedComment = await BlogComment.create({
    blog: blog._id,
    name,
    comment,
  });
  const commentCount = await BlogComment.countDocuments({ blog: blog._id });

  res.status(201).json({
    comment: {
      _id: savedComment._id,
      name: savedComment.name,
      comment: savedComment.comment,
      createdAt: savedComment.createdAt,
    },
    commentCount,
  });
});

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlugOrId(req.params.slug);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Get blog by id
// @route   GET /api/blogs/id/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, description, image, date, category, author } = req.body;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const blog = new Blog({
    title,
    slug,
    excerpt,
    description,
    image,
    category: category || 'Beauty',
    author: author || 'BeautyBliss Editorial',
    date: date || Date.now(),
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, description, image, date, slug, category, author } = req.body;

  const blog = await Blog.findById(req.params.id);

  if (blog) {
    blog.title = title || blog.title;
    blog.slug = slug || blog.slug;
    blog.excerpt = excerpt || blog.excerpt;
    blog.description = description || blog.description;
    blog.image = image || blog.image;
    blog.category = category || blog.category;
    blog.author = author || blog.author;
    if (date) {
        blog.date = date;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    await BlogComment.deleteMany({ blog: blog._id });
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

export {
  getBlogs,
  getBlogBySlug,
  getBlogComments,
  createBlogComment,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
