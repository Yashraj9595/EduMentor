import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorPreference extends Document {
  mentorId: mongoose.Types.ObjectId;
  preferredSkills: string[];
  preferredCategories: string[];
  maxStudents: number;
  availability: {
    days: string[]; // e.g., ['monday', 'tuesday', 'wednesday']
    timeSlots: {
      day: string;
      startTime: string; // e.g., "09:00"
      endTime: string;   // e.g., "17:00"
    }[];
  };
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  mentoringStyle: 'hands-on' | 'guidance' | 'mixed';
  languages: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentPreference extends Document {
  studentId: mongoose.Types.ObjectId;
  interestedSkills: string[];
  preferredCategories: string[];
  preferredMentorExperience: 'beginner' | 'intermediate' | 'advanced';
  preferredMentoringStyle: 'hands-on' | 'guidance' | 'no-preference';
  availability: {
    days: string[];
    timeSlots: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  languages: string[];
  projectInterests: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMentorMatch extends Document {
  studentId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  matchScore: number; // 0-100
  matchingCriteria: {
    skillMatch: number;
    categoryMatch: number;
    availabilityMatch: number;
    experienceMatch: number;
    styleMatch: number;
    languageMatch: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestedBy: 'student' | 'mentor' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

const MentorPreferenceSchema: Schema = new Schema({
  mentorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  preferredSkills: [{ type: String }],
  preferredCategories: [{ type: String }],
  maxStudents: { 
    type: Number, 
    default: 5,
    min: 1,
    max: 20
  },
  availability: {
    days: [{ type: String }],
    timeSlots: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  mentoringStyle: {
    type: String,
    enum: ['hands-on', 'guidance', 'mixed'],
    default: 'mixed'
  },
  languages: [{ type: String }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const StudentPreferenceSchema: Schema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  interestedSkills: [{ type: String }],
  preferredCategories: [{ type: String }],
  preferredMentorExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'no-preference'
  },
  preferredMentoringStyle: {
    type: String,
    enum: ['hands-on', 'guidance', 'no-preference'],
    default: 'no-preference'
  },
  availability: {
    days: [{ type: String }],
    timeSlots: [{
      day: String,
      startTime: String,
      endTime: String
    }]
  },
  languages: [{ type: String }],
  projectInterests: [{ type: String }]
}, {
  timestamps: true
});

const MentorMatchSchema: Schema = new Schema({
  studentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  mentorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  matchScore: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  matchingCriteria: {
    skillMatch: { type: Number, default: 0 },
    categoryMatch: { type: Number, default: 0 },
    availabilityMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    styleMatch: { type: Number, default: 0 },
    languageMatch: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  requestedBy: {
    type: String,
    enum: ['student', 'mentor', 'system'],
    default: 'system'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
MentorPreferenceSchema.index({ mentorId: 1 });
StudentPreferenceSchema.index({ studentId: 1 });
MentorMatchSchema.index({ studentId: 1, mentorId: 1 });
MentorMatchSchema.index({ status: 1 });

export const MentorPreference = mongoose.model<IMentorPreference>('MentorPreference', MentorPreferenceSchema);
export const StudentPreference = mongoose.model<IStudentPreference>('StudentPreference', StudentPreferenceSchema);
export const MentorMatch = mongoose.model<IMentorMatch>('MentorMatch', MentorMatchSchema);