import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  appointmentDate: { type: String, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true, enum: ['In-store consultation', 'Phone call', 'Video consultation'] },
  concern: { type: String, trim: true, maxlength: 100 },
  skinType: { type: String, trim: true, maxlength: 40 },
  sensitivity: { type: String, trim: true, maxlength: 40 },
  fragrancePreference: { type: String, trim: true, maxlength: 60 },
  notes: { type: String, trim: true, maxlength: 2000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
  slotReserved: { type: Boolean, default: true },
  manageTokenHash: { type: String, required: true, select: false },
  reminderSentAt: { type: Date, default: null },
  reminderClaimedAt: { type: Date, default: null },
}, { timestamps: true });

appointmentSchema.index({ appointmentDate: 1, time: 1 }, {
  unique: true,
  partialFilterExpression: { slotReserved: true },
});
appointmentSchema.index({ status: 1, appointmentDate: 1, reminderSentAt: 1 });

export default mongoose.model('Appointment', appointmentSchema);
