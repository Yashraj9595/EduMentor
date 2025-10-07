import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectReview {
  projectId: string;
  mentorId: string;
  reviewType: 'proposal' | 'mid_term' | 'final' | 'custom';
  title: string;
  description: string;
  scheduledDate: Date;
  evaluationCriteria: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  overallScore?: number;
  maxScore?: number;
  feedback?: string;
  mentorNotes?: string;
  changeRequests?: string[];
}

export interface IProjectReviewDocument extends IProjectReview, Document {}

const projectReviewSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewType: {
    type: String,
    enum: ['proposal', 'mid_term', 'final', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  evaluationCriteria: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  overallScore: {
    type: Number,
    min: 0
  },
  maxScore: {
    type: Number,
    default: 100
  },
  feedback: {
    type: String
  },
  mentorNotes: {
    type: String
  },
  changeRequests: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
projectReviewSchema.index({ projectId: 1, mentorId: 1 });
projectReviewSchema.index({ scheduledDate: 1 });
projectReviewSchema.index({ status: 1 });

export const ProjectReview = mongoose.model<IProjectReviewDocument>('ProjectReview', projectReviewSchema);