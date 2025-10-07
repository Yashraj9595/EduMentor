import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDiaryEntry {
  projectId: string;
  studentId: string;
  entryType: 'daily' | 'weekly' | 'milestone' | 'review';
  title: string;
  content: string;
  attachments: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entryDate: Date;
  mentorFeedback?: {
    comment: string;
    rating: number;
    submittedAt: Date;
  };
}

export interface IProjectDiaryDocument extends IProjectDiaryEntry, Document {}

const projectDiarySchema = new Schema({
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
  entryType: {
    type: String,
    enum: ['daily', 'weekly', 'milestone', 'review'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  mentorFeedback: {
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
projectDiarySchema.index({ projectId: 1, studentId: 1 });
projectDiarySchema.index({ entryDate: -1 });
projectDiarySchema.index({ status: 1 });

export const ProjectDiary = mongoose.model<IProjectDiaryDocument>('ProjectDiary', projectDiarySchema);