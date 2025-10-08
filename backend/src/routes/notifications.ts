import { Router } from 'express';
import { 
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationsCount
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user notifications
router.get('/', getUserNotifications);

// Get unread notifications count
router.get('/unread-count', getUnreadNotificationsCount);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

export default router;