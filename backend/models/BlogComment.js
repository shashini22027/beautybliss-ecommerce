import mongoose from 'mongoose';

const blogCommentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

blogCommentSchema.index({ blog: 1, createdAt: -1 });

const BlogComment = mongoose.model('BlogComment', blogCommentSchema);

export default BlogComment;
