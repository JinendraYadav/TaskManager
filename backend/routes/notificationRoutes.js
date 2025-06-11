
import { Router } from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = Router();

// Get all notifications for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    // Find notifications for the authenticated user, sorted by createdAt desc
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to avoid overwhelming response
      
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    // Find notification and check ownership
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Only the notification recipient can mark it as read
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    
    // Mark as read
    notification.isRead = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    // Update all unread notifications for this user
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.json({
      message: 'All notifications marked as read',
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find notification and check ownership
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Only the notification recipient can delete it
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }
    
    await Notification.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a notification (internal use, not exposed as API)
// This would be used by other routes when actions happen that need notifications
export const createNotification = async (data) => {
  try {
    const { message, userId, type, relatedItemId } = data;
    
    if (!message || !userId || !type) {
      throw new Error('Missing required notification fields');
    }
    
    const notification = new Notification({
      message,
      userId,
      type,
      relatedItemId,
      isRead: false
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export default router;
