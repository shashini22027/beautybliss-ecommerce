import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  productName: { type: String, required: true, trim: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
  variantName: { type: String, default: '' },
  type: { type: String, enum: ['adjustment', 'order'], required: true },
  quantityChange: { type: Number, required: true },
  reason: { type: String, required: true, trim: true, maxlength: 200 },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

stockMovementSchema.index({ createdAt: -1 });

export default mongoose.model('StockMovement', stockMovementSchema);
