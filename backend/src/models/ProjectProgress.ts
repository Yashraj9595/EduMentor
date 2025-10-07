import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectProgress {
  projectId: string;
  studentId: string;
  currentProgress: number;
  lastUpdate: Date;
  badgesEarned: string[];
  points: number;
  level: number;
  weeklyGoal: number;
  weeklyProgress: number;
  overallProgress: number;
  totalPoints: number;
}

export interface IProjectProgressDocument extends IProjectProgress, Document {}

const projectProgressSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  badgesEarned: [{
    type: String
  }],
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  weeklyGoal: {
    type: Number,
    default: 20
  },
  weeklyProgress: {
    type: Number,
    default: 0
  },
  overallProgress: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
projectProgressSchema.index({ projectId: 1, studentId: 1 });
projectProgressSchema.index({ studentId: 1 });

export const ProjectProgress = mongoose.model<IProjectProgressDocument>('ProjectProgress', projectProgressSchema);