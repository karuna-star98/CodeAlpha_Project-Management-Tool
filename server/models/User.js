import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String, default: '' },
    role: { type: String, default: 'member', enum: ['member', 'admin'] }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
