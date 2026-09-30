import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

projectSchema.index({ memberIds: 1 });
projectSchema.index({ ownerId: 1 });

export default mongoose.model('Project', projectSchema);
