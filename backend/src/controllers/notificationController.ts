import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { IAuthRequest } from '../types';

// Get user notifications
export const getUserNotifications = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { limit = 20, offset = 0, read } = req.query;
    
    // Build filter object
    const filter: any = { userId: req.user?._id };
    
    if (read !== undefined) {
      filter.read = read === 'true';
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset))
      .populate('senderId', 'firstName lastName email');
    
    const total = await Notification.countDocuments(filter);
    
    return res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: notifications,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: (error as Error).message
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: (error as Error).message
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    await Notification.updateMany(
      { userId: req.user?._id, read: false },
      { read: true }
    );
    
    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: (error as Error).message
    });
  }
};

// Delete notification
export const deleteNotification = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user?._id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: (error as Error).message
    });
  }
};

// Create a new notification
export const createNotification = async (notificationData: {
  title: string;
  message: string;
  userId: string;
  senderId?: string;
  type?: string;
  priority?: string;
  relatedProjectId?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}): Promise<void> => {
  try {
    const notification = new Notification({
      title: notificationData.title,
      message: notificationData.message,
      userId: notificationData.userId,
      senderId: notificationData.senderId,
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'medium',
      relatedProjectId: notificationData.relatedProjectId,
      relatedEntityId: notificationData.relatedEntityId,
      relatedEntityType: notificationData.relatedEntityType
    });
    
    await notification.save();
    console.log('Notification created:', notification._id);
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (req: IAuthRequest, res: Response): Promise<Response> => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user?._id,
      read: false
    });
    
    return res.json({
      success: true,
      message: 'Unread notifications count retrieved',
      data: { count }
    });
  } catch (error) {
    console.error('Get unread notifications count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve unread notifications count',
      error: (error as Error).message
    });
  }
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
  getUnreadNotificationsCount
};