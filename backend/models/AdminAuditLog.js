import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actorEmail: { type: String, required: true, trim: true, lowercase: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  statusCode: { type: Number, required: true },
}, { timestamps: true });

adminAuditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AdminAuditLog', adminAuditLogSchema);
