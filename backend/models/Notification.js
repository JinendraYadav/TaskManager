
import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['task', 'comment', 'mention', 'system'],
    required: true
  },
  relatedItemId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for quick retrieval of user's notifications
notificationSchema.index({ userId: 1, createdAt: -1 });

export default model('Notification', notificationSchema);
