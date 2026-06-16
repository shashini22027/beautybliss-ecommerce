import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '' },
  image: { type: String, default: '' },
  countInStock: { type: Number, default: 0 },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: '' },
  images: [{ type: String }],
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  subcategory: { type: String },
  color: { type: String },
  variants: [variantSchema],
  country: { type: String },
  price: { type: Number, required: true, default: 0 },
  compareAtPrice: { type: Number, default: null },
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  discountLabel: { type: String, default: '' },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isHotDeal: { type: Boolean, default: false },
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
