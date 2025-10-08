import mongoose, { Document, Schema } from 'mongoose';

export interface IProblemStatement extends Document {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  skillsRequired: string[];
  postedBy: mongoose.Types.ObjectId;
  isActive: boolean;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemStatementSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  technologies: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  estimatedDuration: { type: String, required: true },
  skillsRequired: [{ type: String }],
  postedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  projectCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const ProblemStatement = mongoose.model<IProblemStatement>('ProblemStatement', ProblemStatementSchema);