
import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  mentions: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Indexes for common queries
commentSchema.index({ taskId: 1 });
commentSchema.index({ userId: 1 });

export default model('Comment', commentSchema);
