import mongoose, { Document, Schema } from 'mongoose';
import { INotification } from '../types';

export interface INotificationDocument extends Omit<INotification, '_id'>, Document {}

const notificationSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'mentor_request', 'project_update'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedProjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  relatedEntityId: {
    type: Schema.Types.ObjectId
  },
  relatedEntityType: {
    type: String,
    enum: ['project', 'mentor_request', 'diary', 'review']
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);