import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMilestone {
  projectId: string;
  title: string;
  description: string;
  type: 'deliverable' | 'review' | 'presentation' | 'submission';
  dueDate: Date;
  weight: number;
  requirements: string[];
  deliverables: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
  mentorApproval?: boolean;
  studentNotes?: string;
}

export interface IProjectMilestoneDocument extends IProjectMilestone, Document {}

const projectMilestoneSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
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
  type: {
    type: String,
    enum: ['deliverable', 'review', 'presentation', 'submission'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  requirements: [{
    type: String
  }],
  deliverables: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  completedAt: {
    type: Date
  },
  mentorApproval: {
    type: Boolean,
    default: false
  },
  studentNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
projectMilestoneSchema.index({ projectId: 1 });
projectMilestoneSchema.index({ dueDate: 1 });
projectMilestoneSchema.index({ status: 1 });

export const ProjectMilestone = mongoose.model<IProjectMilestoneDocument>('ProjectMilestone', projectMilestoneSchema);