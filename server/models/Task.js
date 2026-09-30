import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 3000 },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });

export default mongoose.model('Task', taskSchema);
