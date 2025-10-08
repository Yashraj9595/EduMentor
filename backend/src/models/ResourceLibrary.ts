import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  category: string;
  type: 'document' | 'template' | 'video' | 'link' | 'code';
  fileUrl?: string;
  externalUrl?: string;
  content?: string; // For text-based resources
  tags: string[];
  author: mongoose.Types.ObjectId; // Reference to User
  isPublic: boolean;
  downloads: number;
  views: number;
  likes: number;
  relatedSkills: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceRating extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceDownload extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  downloadDate: Date;
}

const ResourceSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['project-template', 'tutorial', 'best-practices', 'case-study', 'tool', 'research-paper', 'other']
  },
  type: { 
    type: String, 
    required: true,
    enum: ['document', 'template', 'video', 'link', 'code']
  },
  fileUrl: { 
    type: String,
    trim: true
  },
  externalUrl: { 
    type: String,
    trim: true
  },
  content: { 
    type: String 
  },
  tags: [{ 
    type: String,
    trim: true
  }],
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  downloads: { 
    type: Number, 
    default: 0,
    min: 0
  },
  views: { 
    type: Number, 
    default: 0,
    min: 0
  },
  likes: { 
    type: Number, 
    default: 0,
    min: 0
  },
  relatedSkills: [{ 
    type: String,
    trim: true
  }],
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  }
}, {
  timestamps: true
});

const ResourceRatingSchema: Schema = new Schema({
  resourceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Resource', 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const ResourceDownloadSchema: Schema = new Schema({
  resourceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Resource', 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  downloadDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, type: 1 });
ResourceSchema.index({ author: 1 });
ResourceRatingSchema.index({ resourceId: 1, userId: 1 }, { unique: true });
ResourceDownloadSchema.index({ resourceId: 1, userId: 1 });

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
export const ResourceRating = mongoose.model<IResourceRating>('ResourceRating', ResourceRatingSchema);
export const ResourceDownload = mongoose.model<IResourceDownload>('ResourceDownload', ResourceDownloadSchema);