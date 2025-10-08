import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorConnection extends Document {
  mentor1: mongoose.Types.ObjectId; // Reference to User
  mentor2: mongoose.Types.ObjectId; // Reference to User
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  requestedBy: mongoose.Types.ObjectId; // Who sent the request
  connectedAt?: Date;
  blockedBy?: mongoose.Types.ObjectId;
  blockedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMentorGroup extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId; // Reference to User
  members: mongoose.Types.ObjectId[]; // References to Users
  admins: mongoose.Types.ObjectId[]; // References to Users
  isPublic: boolean;
  joinRequests: {
    user: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMentorDiscussion extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId; // Reference to User
  groupId?: mongoose.Types.ObjectId; // If part of a group discussion
  tags: string[];
  likes: mongoose.Types.ObjectId[]; // References to Users who liked
  replies: {
    author: mongoose.Types.ObjectId;
    content: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
  }[];
  views: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MentorConnectionSchema: Schema = new Schema({
  mentor1: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mentor2: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  requestedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  connectedAt: { 
    type: Date 
  },
  blockedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  blockedReason: { 
    type: String 
  }
}, {
  timestamps: true
});

const MentorGroupSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  admins: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  joinRequests: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const MentorDiscussionSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  groupId: { 
    type: Schema.Types.ObjectId, 
    ref: 'MentorGroup' 
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  replies: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  views: { 
    type: Number, 
    default: 0,
    min: 0
  },
  isPinned: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
MentorConnectionSchema.index({ mentor1: 1, mentor2: 1 });
MentorConnectionSchema.index({ status: 1 });
MentorGroupSchema.index({ name: 'text', description: 'text' });
MentorGroupSchema.index({ createdBy: 1 });
MentorDiscussionSchema.index({ title: 'text', content: 'text' });
MentorDiscussionSchema.index({ author: 1 });
MentorDiscussionSchema.index({ groupId: 1 });
MentorDiscussionSchema.index({ tags: 1 });

export const MentorConnection = mongoose.model<IMentorConnection>('MentorConnection', MentorConnectionSchema);
export const MentorGroup = mongoose.model<IMentorGroup>('MentorGroup', MentorGroupSchema);
export const MentorDiscussion = mongoose.model<IMentorDiscussion>('MentorDiscussion', MentorDiscussionSchema);