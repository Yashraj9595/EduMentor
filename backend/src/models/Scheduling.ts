import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  description: string;
  mentor: mongoose.Types.ObjectId; // Reference to User
  student: mongoose.Types.ObjectId; // Reference to User
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  meetingType: 'in-person' | 'video' | 'phone';
  location?: string; // For in-person meetings
  meetingLink?: string; // For video meetings
  reminderSent: boolean;
  calendarEventId?: string; // For integration with external calendars
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailability extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  days: {
    day: string; // e.g., 'monday', 'tuesday'
    isAvailable: boolean;
    timeSlots: {
      startTime: string; // e.g., "09:00"
      endTime: string;   // e.g., "17:00"
      isBooked: boolean;
    }[];
  }[];
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReminder extends Document {
  meeting: mongoose.Types.ObjectId; // Reference to Meeting
  recipient: mongoose.Types.ObjectId; // Reference to User
  reminderTime: Date;
  method: 'email' | 'notification' | 'sms';
  isSent: boolean;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  mentor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  meetingType: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    default: 'video'
  },
  location: { 
    type: String,
    trim: true
  },
  meetingLink: { 
    type: String,
    trim: true
  },
  reminderSent: { 
    type: Boolean, 
    default: false 
  },
  calendarEventId: { 
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const AvailabilitySchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  days: [{
    day: { type: String, required: true },
    isAvailable: { type: Boolean, default: false },
    timeSlots: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      isBooked: { type: Boolean, default: false }
    }]
  }],
  timezone: { 
    type: String, 
    default: 'UTC' 
  }
}, {
  timestamps: true
});

const ReminderSchema: Schema = new Schema({
  meeting: { 
    type: Schema.Types.ObjectId, 
    ref: 'Meeting', 
    required: true 
  },
  recipient: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reminderTime: { 
    type: Date, 
    required: true 
  },
  method: {
    type: String,
    enum: ['email', 'notification', 'sms'],
    default: 'email'
  },
  isSent: { 
    type: Boolean, 
    default: false 
  },
  sentAt: { 
    type: Date 
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
MeetingSchema.index({ mentor: 1, student: 1 });
MeetingSchema.index({ startTime: 1 });
MeetingSchema.index({ status: 1 });
AvailabilitySchema.index({ userId: 1 });
ReminderSchema.index({ meeting: 1, recipient: 1 });
ReminderSchema.index({ reminderTime: 1 });

export const Meeting = mongoose.model<IMeeting>('Meeting', MeetingSchema);
export const Availability = mongoose.model<IAvailability>('Availability', AvailabilitySchema);
export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);