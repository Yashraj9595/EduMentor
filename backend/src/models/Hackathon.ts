import mongoose, { Document, Schema } from 'mongoose';

export interface IHackathonDocument extends Document {
  title: string;
  description: string;
  shortDescription: string;
  startDate: Date;
  endDate: Date;
  registrationStart: Date;
  registrationEnd: Date;
  submissionDeadline: Date;
  location: string;
  locationType: 'physical' | 'virtual' | 'hybrid';
  maxTeams: number;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: string;
  currency: string;
  tags: string[];
  categories: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  requirements: {
    pitchDeck: boolean;
    sourceCode: boolean;
    demoVideo: boolean;
    documentation: boolean;
    teamPhoto: boolean;
    presentation: boolean;
    prototype: boolean;
  };
  judgingCriteria: {
    innovation: number;
    technical: number;
    presentation: number;
    impact: number;
    creativity: number;
    feasibility: number;
  };
  rules: string[];
  prizes: {
    position: string;
    amount: string;
    description: string;
    icon?: string;
  }[];
  sponsors: {
    name: string;
    logo: string;
    website: string;
    description: string;
    tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  }[];
  mentors: {
    name: string;
    email: string;
    expertise: string[];
    bio: string;
  }[];
  resources: {
    title: string;
    type: 'document' | 'video' | 'link' | 'template';
    url: string;
    description: string;
  }[];
  contactInfo: {
    email: string;
    phone: string;
    website: string;
    socialMedia: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
    };
  };
  submissionStages: {
    id: string;
    name: string;
    type: 'online_ppt' | 'prototype_review' | 'offline_review';
    date: Date;
    description: string;
    requirements: string[];
  }[];
  volunteers: {
    name: string;
    email: string;
    phone: string;
    role: string;
    expertise: string[];
    availability: string;
    description: string;
  }[];
  organizerId: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  participants: number;
  teams: number;
  registrations: {
    teamLead: mongoose.Types.ObjectId;
    teamName: string;
    teamDescription: string;
    members: {
      name: string;
      email: string;
      role: string;
      skills: string[];
      phone?: string;
      university?: string;
      year?: string;
    }[];
    projectIdea?: string;
    technologies: string[];
    experience: 'beginner' | 'intermediate' | 'advanced';
    motivation?: string;
    previousHackathons?: string;
    availability?: string;
    specialRequirements?: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    registeredAt: Date;
    status: 'registered' | 'cancelled';
  }[];
  submissions: {
    teamLead: mongoose.Types.ObjectId;
    projectTitle: string;
    projectDescription: string;
    problemStatement: string;
    solution: string;
    technologies: string[];
    features: string[];
    challenges: string[];
    learnings: string[];
    futurePlans?: string;
    demoUrl?: string;
    repositoryUrl?: string;
    presentationUrl?: string;
    files: {
      id: string;
      name: string;
      type: 'document' | 'video' | 'image' | 'code' | 'link';
      url: string;
      size?: number;
      uploadedAt: Date;
    }[];
    teamMembers: {
      name: string;
      role: string;
      contribution: string;
    }[];
    acknowledgments?: string;
    additionalNotes?: string;
    submittedAt: Date;
    status: 'submitted' | 'under_review' | 'judged';
    scores: {
      innovation: number;
      technical: number;
      presentation: number;
      impact: number;
      creativity: number;
      feasibility: number;
      total: number;
    };
    reviews: {
      judgeId: mongoose.Types.ObjectId;
      scores: {
        innovation: number;
        technical: number;
        presentation: number;
        impact: number;
        creativity: number;
        feasibility: number;
      };
      feedback: string;
      reviewedAt: Date;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const submissionStageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['online_ppt', 'prototype_review', 'offline_review'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  requirements: [{
    type: String,
    trim: true
  }]
}, {
  _id: false,
  timestamps: false
});

const volunteerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  _id: false,
  timestamps: false
});

const mentorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  expertise: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true
  }
}, {
  _id: false,
  timestamps: false
});

const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'template'],
    required: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  _id: false,
  timestamps: false
});

const prizeSchema = new Schema({
  position: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  }
}, {
  _id: false,
  timestamps: false
});

const sponsorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tier: {
    type: String,
    enum: ['platinum', 'gold', 'silver', 'bronze'],
    default: 'bronze'
  }
}, {
  _id: false,
  timestamps: false
});

const hackathonSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Hackathon title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Hackathon description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [150, 'Short description cannot exceed 150 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  registrationStart: {
    type: Date
  },
  registrationEnd: {
    type: Date
  },
  submissionDeadline: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  locationType: {
    type: String,
    enum: ['physical', 'virtual', 'hybrid'],
    default: 'physical'
  },
  maxTeams: {
    type: Number,
    default: 50,
    min: [1, 'Max teams must be at least 1']
  },
  maxTeamSize: {
    type: Number,
    default: 4,
    min: [1, 'Max team size must be at least 1']
  },
  minTeamSize: {
    type: Number,
    default: 2,
    min: [1, 'Min team size must be at least 1']
  },
  prizePool: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'mixed'],
    default: 'mixed'
  },
  requirements: {
    pitchDeck: {
      type: Boolean,
      default: true
    },
    sourceCode: {
      type: Boolean,
      default: true
    },
    demoVideo: {
      type: Boolean,
      default: true
    },
    documentation: {
      type: Boolean,
      default: true
    },
    teamPhoto: {
      type: Boolean,
      default: true
    },
    presentation: {
      type: Boolean,
      default: true
    },
    prototype: {
      type: Boolean,
      default: false
    }
  },
  judgingCriteria: {
    innovation: {
      type: Number,
      default: 20,
      min: [0, 'Innovation criteria cannot be negative'],
      max: [50, 'Innovation criteria cannot exceed 50']
    },
    technical: {
      type: Number,
      default: 20,
      min: [0, 'Technical criteria cannot be negative'],
      max: [50, 'Technical criteria cannot exceed 50']
    },
    presentation: {
      type: Number,
      default: 20,
      min: [0, 'Presentation criteria cannot be negative'],
      max: [50, 'Presentation criteria cannot exceed 50']
    },
    impact: {
      type: Number,
      default: 20,
      min: [0, 'Impact criteria cannot be negative'],
      max: [50, 'Impact criteria cannot exceed 50']
    },
    creativity: {
      type: Number,
      default: 10,
      min: [0, 'Creativity criteria cannot be negative'],
      max: [50, 'Creativity criteria cannot exceed 50']
    },
    feasibility: {
      type: Number,
      default: 10,
      min: [0, 'Feasibility criteria cannot be negative'],
      max: [50, 'Feasibility criteria cannot exceed 50']
    }
  },
  rules: [{
    type: String,
    trim: true
  }],
  prizes: [prizeSchema],
  sponsors: [sponsorSchema],
  mentors: [mentorSchema],
  resources: [resourceSchema],
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    socialMedia: {
      twitter: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      facebook: {
        type: String,
        trim: true
      }
    }
  },
  submissionStages: [submissionStageSchema],
  volunteers: [volunteerSchema],
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer ID is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  participants: {
    type: Number,
    default: 0,
    min: [0, 'Participants cannot be negative']
  },
  teams: {
    type: Number,
    default: 0,
    min: [0, 'Teams cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes
hackathonSchema.index({ organizerId: 1 });
hackathonSchema.index({ status: 1 });
hackathonSchema.index({ startDate: 1 });
hackathonSchema.index({ endDate: 1 });
hackathonSchema.index({ createdAt: -1 });
hackathonSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

// Virtual for hackathon duration
hackathonSchema.virtual('duration').get(function() {
  return Math.ceil((this.get('endDate').getTime() - this.get('startDate').getTime()) / (1000 * 60 * 60 * 24));
});

// Pre-save validation for judging criteria
hackathonSchema.pre('save', function(next) {
  const criteria = this.judgingCriteria;
  const total = criteria.innovation + criteria.technical + criteria.presentation + 
                criteria.impact + criteria.creativity + criteria.feasibility;
  
  if (total !== 100) {
    return next(new Error('Judging criteria must total exactly 100%'));
  }
  
  next();
});

export const Hackathon = mongoose.model<IHackathonDocument>('Hackathon', hackathonSchema);
