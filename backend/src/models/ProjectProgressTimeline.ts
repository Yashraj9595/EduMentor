import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectProgressTimeline extends Document {
  projectId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  mentorId?: mongoose.Types.ObjectId;
  timelineSteps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    progress: number;
    points: number;
    gems: number;
    level: number;
    specialEffect?: 'sparkle' | 'crown' | 'diamond' | 'gem' | 'trophy';
    completedAt?: Date;
    startedAt?: Date;
  }>;
  overallProgress: number;
  totalPoints: number;
  totalGems: number;
  currentLevel: number;
  nextLevelPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectProgressTimelineSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timelineSteps: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'current', 'upcoming'],
      default: 'upcoming'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    points: {
      type: Number,
      default: 0
    },
    gems: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    specialEffect: {
      type: String,
      enum: ['sparkle', 'crown', 'diamond', 'gem', 'trophy']
    },
    completedAt: {
      type: Date
    },
    startedAt: {
      type: Date
    }
  }],
  overallProgress: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  totalGems: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  nextLevelPoints: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

// Indexes
projectProgressTimelineSchema.index({ projectId: 1 });
projectProgressTimelineSchema.index({ studentId: 1 });
projectProgressTimelineSchema.index({ mentorId: 1 });

export const ProjectProgressTimeline = mongoose.model<IProjectProgressTimeline>('ProjectProgressTimeline', projectProgressTimelineSchema);