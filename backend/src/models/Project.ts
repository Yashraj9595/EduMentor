import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from '../types';

export interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const milestoneSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Milestone description is required'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Milestone due date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  }
}, {
  _id: false,
  timestamps: false
});

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Project title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  longDescription: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'in_progress', 'under_review', 'completed', 'archived'],
    default: 'draft'
  },
  startDate: {
    type: Date,
    required: [true, 'Project start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Project end date is required']
  },
  deliverables: [{
    type: String,
    trim: true
  }],
  milestones: [milestoneSchema],
  tags: [{
    type: String,
    trim: true
  }],
  problemStatement: {
    type: String,
    trim: true
  },
  repositoryLink: {
    type: String,
    trim: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  documentationUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  teamMembers: [{
    email: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true
    }
  }],
  thumbnail: {
    type: String,
    trim: true
  },
  objectives: [{
    type: String,
    trim: true
  }],
  challenges: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  gallery: [{
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    caption: {
      type: String,
      trim: true
    }
  }],
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  awards: [{
    title: {
      type: String,
      trim: true
    },
    organization: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Indexes
projectSchema.index({ studentId: 1 });
projectSchema.index({ mentorId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  return Math.ceil((this.get('endDate').getTime() - this.get('startDate').getTime()) / (1000 * 60 * 60 * 24));
});

export const Project = mongoose.model<IProjectDocument>('Project', projectSchema);