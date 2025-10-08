import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorAnalytics extends Document {
  mentorId: mongoose.Types.ObjectId;
  period: {
    startDate: Date;
    endDate: Date;
  };
  studentMetrics: {
    totalStudents: number;
    activeStudents: number;
    completedProjects: number;
    averageProgress: number;
    studentSatisfaction: number; // Based on student feedback
  };
  mentoringActivity: {
    totalSessions: number;
    totalHours: number;
    avgSessionDuration: number;
    feedbackProvided: number;
  };
  projectMetrics: {
    projectsMentored: number;
    onTimeCompletion: number; // Percentage
    avgProjectScore: number;
    innovationScore: number; // Based on project creativity
  };
  skillDevelopment: {
    technicalSkills: Map<string, number>; // Skill name to proficiency improvement
    softSkills: Map<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MentorAnalyticsSchema: Schema = new Schema({
  mentorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  studentMetrics: {
    totalStudents: { type: Number, default: 0 },
    activeStudents: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    averageProgress: { type: Number, default: 0 },
    studentSatisfaction: { type: Number, default: 0 }
  },
  mentoringActivity: {
    totalSessions: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    feedbackProvided: { type: Number, default: 0 }
  },
  projectMetrics: {
    projectsMentored: { type: Number, default: 0 },
    onTimeCompletion: { type: Number, default: 0 },
    avgProjectScore: { type: Number, default: 0 },
    innovationScore: { type: Number, default: 0 }
  },
  skillDevelopment: {
    technicalSkills: { type: Map, of: Number, default: {} },
    softSkills: { type: Map, of: Number, default: {} }
  }
}, {
  timestamps: true
});

export const MentorAnalytics = mongoose.model<IMentorAnalytics>('MentorAnalytics', MentorAnalyticsSchema);