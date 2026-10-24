import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, unique: true, sparse: true },
  checkoutKey: { type: String, unique: true, sparse: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  customer: {
    name: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
  },
  orderItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1, max: 20 },
    image: { type: String, required: true },
    color: { type: String, default: '' },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: false },
    price: { type: Number, required: true, min: 0 },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, default: 'Cash On Delivery' },
  paymentResult: { id: String, status: String, update_time: String, email_address: String, refundId: String, refundStatus: String },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
