import mongoose, { Document, Schema } from 'mongoose';

export interface IReportDraft extends Document {
  userId: string;
  title: string;
  data: string;
  template: string;
  format: string;
  citationStyle: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportDraftSchema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: String,
    required: true
  },
  template: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  citationStyle: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const ReportDraft = mongoose.model<IReportDraft>('ReportDraft', reportDraftSchema);
