import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, trim: true, lowercase: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  verifiedPurchase: { type: Boolean, default: false },
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String, enum: ['inappropriate', 'spam', 'other'], default: 'inappropriate' },
    createdAt: { type: Date, default: Date.now },
  }],
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
  }],
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '' },
  undertone: { type: String, enum: ['', 'Warm', 'Cool', 'Neutral'], default: '' },
  finish: { type: String, trim: true, maxlength: 40, default: '' },
  image: { type: String, default: '' },
  countInStock: { type: Number, min: 0, default: 0 },
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: '' },
  images: [{ type: String }],
  description: { type: String, required: true },
  ingredients: { type: String, trim: true, maxlength: 4000, default: '' },
  keyIngredients: [{ type: String, trim: true, maxlength: 80 }],
  skinTypes: [{ type: String, enum: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'] }],
  skinConcerns: [{ type: String, enum: ['acne', 'dryness', 'dark-spots', 'sensitive'] }],
  fragranceFree: { type: Boolean, default: null },
  allergyWarnings: { type: String, trim: true, maxlength: 1000, default: '' },
  howToUse: { type: String, trim: true, maxlength: 2000, default: '' },
  size: { type: String, trim: true, maxlength: 100, default: '' },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  subcategory: { type: String },
  color: { type: String },
  variants: [variantSchema],
  country: { type: String },
  price: { type: Number, min: 0, required: true, default: 0 },
  compareAtPrice: { type: Number, min: 0, default: null },
  countInStock: { type: Number, min: 0, required: true, default: 0 },
  lowStockThreshold: { type: Number, min: 0, default: 5 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  discountLabel: { type: String, default: '' },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isHotDeal: { type: Boolean, default: false },
  isSpecialOffer: { type: Boolean, default: false },
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
