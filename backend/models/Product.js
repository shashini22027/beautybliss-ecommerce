import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: '' },
  images: [{ type: String }],
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  subcategory: { type: String },
  color: { type: String },
  country: { type: String },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
