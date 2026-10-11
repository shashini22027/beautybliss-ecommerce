import mongoose from 'mongoose';

const orderSequenceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    value: { type: Number, required: true, default: 51 },
  },
  { versionKey: false }
);

export default mongoose.model('OrderSequence', orderSequenceSchema);
