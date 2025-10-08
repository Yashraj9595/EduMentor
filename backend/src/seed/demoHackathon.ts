import mongoose from 'mongoose';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';
import connectDB from '../config/database';

const demoHackathonData = {
  title: "EduMentor Innovation Challenge 2024",
  description: `Join the most exciting educational technology hackathon of the year! The EduMentor Innovation Challenge 2024 brings together students, developers, and educators to create groundbreaking solutions that will shape the future of education.

This 48-hour hackathon focuses on developing innovative educational technologies that can transform how students learn, teachers teach, and institutions operate. Whether you're passionate about AI in education, virtual learning environments, student engagement tools, or educational analytics, this is your chance to make a real impact.

Participants will work in teams to build solutions addressing key challenges in modern education, including personalized learning, accessibility, remote education, and student success tracking. The hackathon features workshops, mentorship sessions, and networking opportunities with industry experts.

Winners will receive cash prizes, internship opportunities, and the chance to see their solutions implemented in real educational institutions.`,
  
  shortDescription: "A 48-hour hackathon focused on creating innovative educational technologies that transform learning experiences.",
  
  startDate: new Date('2024-03-15T09:00:00Z'),
  endDate: new Date('2024-03-17T18:00:00Z'),
  registrationStart: new Date('2024-02-01T00:00:00Z'),
  registrationEnd: new Date('2024-03-10T23:59:59Z'),
  submissionDeadline: new Date('2024-03-17T16:00:00Z'),
  
  location: "EduMentor Innovation Center, San Francisco, CA",
  locationType: "physical" as const,
  
  maxTeams: 50,
  maxTeamSize: 4,
  minTeamSize: 2,
  
  prizePool: "$25,000",
  currency: "USD",
  
  tags: [
    "Education Technology",
    "AI/ML",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "User Experience",
    "Accessibility",
    "Innovation"
  ],
  
  categories: [
    "Educational AI",
    "Learning Management Systems",
    "Student Engagement Tools",
    "Assessment & Analytics",
    "Accessibility Solutions",
    "Virtual Learning Environments"
  ],
  
  difficulty: "mixed" as const,
  
  requirements: {
    pitchDeck: true,
    sourceCode: true,
    demoVideo: true,
    documentation: true,
    teamPhoto: true,
    presentation: true,
    prototype: true
  },
  
  judgingCriteria: {
    innovation: 25,
    technical: 20,
    presentation: 15,
    impact: 20,
    creativity: 10,
    feasibility: 10
  },
  
  rules: [
    "All code must be written during the hackathon period",
    "Teams must consist of 2-4 members",
    "Participants must be currently enrolled students or recent graduates",
    "Projects must address educational challenges",
    "All team members must be present for the final presentation",
    "No use of pre-existing commercial solutions",
    "Respect intellectual property and cite all sources",
    "Maintain a positive and inclusive environment"
  ],
  
  prizes: [
    {
      position: "1st Place",
      amount: "$10,000",
      description: "Grand prize for the most innovative educational solution",
      icon: "🏆"
    },
    {
      position: "2nd Place",
      amount: "$7,500",
      description: "Second place for outstanding technical implementation",
      icon: "🥈"
    },
    {
      position: "3rd Place",
      amount: "$5,000",
      description: "Third place for creative problem-solving approach",
      icon: "🥉"
    },
    {
      position: "Best AI Solution",
      amount: "$2,500",
      description: "Special prize for the best AI-powered educational tool",
      icon: "🤖"
    },
    {
      position: "Most Accessible",
      amount: "$2,500",
      description: "Prize for the most inclusive and accessible solution",
      icon: "♿"
    },
    {
      position: "People's Choice",
      amount: "$1,500",
      description: "Awarded by participant voting",
      icon: "👥"
    }
  ],
  
  sponsors: [
    {
      name: "EduMentor Technologies",
      logo: "https://edumentor.dev/logo.png",
      website: "https://edumentor.dev",
      description: "Leading educational technology platform",
      tier: "platinum" as const
    },
    {
      name: "Google for Education",
      logo: "https://edu.google.com/logo.png",
      website: "https://edu.google.com",
      description: "Empowering educators and students worldwide",
      tier: "gold" as const
    },
    {
      name: "Microsoft Education",
      logo: "https://education.microsoft.com/logo.png",
      website: "https://education.microsoft.com",
      description: "Transforming education through technology",
      tier: "gold" as const
    },
    {
      name: "GitHub Education",
      logo: "https://education.github.com/logo.png",
      website: "https://education.github.com",
      description: "Supporting student developers",
      tier: "silver" as const
    },
    {
      name: "AWS Educate",
      logo: "https://aws.amazon.com/education/logo.png",
      website: "https://aws.amazon.com/education",
      description: "Cloud computing for education",
      tier: "silver" as const
    }
  ],
  
  mentors: [
    {
      name: "Dr. Sarah Chen",
      email: "sarah.chen@edumentor.dev",
      expertise: ["Educational Technology", "AI/ML", "User Research"],
      bio: "Former Google Education researcher with 10+ years in EdTech innovation"
    },
    {
      name: "Prof. Michael Rodriguez",
      email: "michael.rodriguez@university.edu",
      expertise: ["Computer Science", "Learning Analytics", "Data Science"],
      bio: "Professor of Computer Science specializing in educational data mining"
    },
    {
      name: "Alex Thompson",
      email: "alex.thompson@techcorp.com",
      expertise: ["Full Stack Development", "Mobile Apps", "API Design"],
      bio: "Senior Software Engineer at major tech company, hackathon veteran"
    },
    {
      name: "Dr. Lisa Park",
      email: "lisa.park@designstudio.com",
      expertise: ["UX/UI Design", "Accessibility", "User Experience"],
      bio: "UX Designer focused on inclusive educational interfaces"
    }
  ],
  
  resources: [
    {
      title: "EduMentor API Documentation",
      type: "document" as const,
      url: "https://docs.edumentor.dev/api",
      description: "Complete API reference for integrating with EduMentor platform"
    },
    {
      title: "Educational Technology Trends 2024",
      type: "document" as const,
      url: "https://edumentor.dev/trends-2024.pdf",
      description: "Research report on current trends in educational technology"
    },
    {
      title: "Building Accessible EdTech Solutions",
      type: "video" as const,
      url: "https://youtube.com/watch?v=accessibility-guide",
      description: "Workshop on creating inclusive educational technologies"
    },
    {
      title: "AI in Education: Best Practices",
      type: "video" as const,
      url: "https://youtube.com/watch?v=ai-education-guide",
      description: "Expert panel discussion on implementing AI in educational contexts"
    },
    {
      title: "Project Template Repository",
      type: "link" as const,
      url: "https://github.com/edumentor/hackathon-templates",
      description: "Starter templates for common educational technology projects"
    },
    {
      title: "Design System Guidelines",
      type: "template" as const,
      url: "https://design.edumentor.dev",
      description: "UI/UX guidelines for consistent educational interfaces"
    }
  ],
  
  contactInfo: {
    email: "hackathon@edumentor.dev",
    phone: "+1 (555) 123-4567",
    website: "https://hackathon.edumentor.dev",
    socialMedia: {
      twitter: "https://twitter.com/edumentor_hack",
      linkedin: "https://linkedin.com/company/edumentor",
      facebook: "https://facebook.com/edumentor"
    }
  },
  
  submissionStages: [
    {
      id: "initial-concept",
      name: "Initial Concept Submission",
      type: "online_ppt" as const,
      date: new Date('2024-03-15T14:00:00Z'),
      description: "Submit your initial project concept and team introduction",
      requirements: [
        "Project pitch deck (5-10 slides)",
        "Team member introductions",
        "Problem statement",
        "Proposed solution overview"
      ]
    },
    {
      id: "midpoint-review",
      name: "Midpoint Progress Review",
      type: "prototype_review" as const,
      date: new Date('2024-03-16T14:00:00Z'),
      description: "Present your progress and receive feedback from mentors",
      requirements: [
        "Working prototype or demo",
        "Technical architecture overview",
        "Challenges faced and solutions",
        "Next steps and timeline"
      ]
    },
    {
      id: "final-presentation",
      name: "Final Project Presentation",
      type: "offline_review" as const,
      date: new Date('2024-03-17T16:00:00Z'),
      description: "Final presentation to judges and participants",
      requirements: [
        "Complete project demonstration",
        "Source code repository",
        "Documentation and user guide",
        "Impact and future plans"
      ]
    }
  ],
  
  volunteers: [
    {
      name: "Jennifer Martinez",
      email: "jennifer.martinez@edumentor.dev",
      phone: "+1 (555) 234-5678",
      role: "Event Coordinator",
      expertise: ["Event Management", "Logistics", "Team Building"],
      availability: "Full weekend",
      description: "Experienced hackathon organizer with 5+ years of event management"
    },
    {
      name: "David Kim",
      email: "david.kim@techcorp.com",
      phone: "+1 (555) 345-6789",
      role: "Technical Mentor",
      expertise: ["Full Stack Development", "Cloud Computing", "DevOps"],
      availability: "Saturday-Sunday 9 AM - 6 PM",
      description: "Senior developer passionate about helping students learn new technologies"
    },
    {
      name: "Maria Santos",
      email: "maria.santos@university.edu",
      phone: "+1 (555) 456-7890",
      role: "Design Mentor",
      expertise: ["UI/UX Design", "User Research", "Prototyping"],
      availability: "Saturday 10 AM - 4 PM",
      description: "Design professor specializing in educational interface design"
    },
    {
      name: "James Wilson",
      email: "james.wilson@startup.com",
      phone: "+1 (555) 567-8901",
      role: "Business Mentor",
      expertise: ["Startup Strategy", "Product Management", "Pitching"],
      availability: "Sunday 2 PM - 6 PM",
      description: "Startup founder with experience in EdTech entrepreneurship"
    }
  ],
  
  status: "published" as const,
  participants: 0,
  teams: 0
};

const insertDemoHackathon = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find or create institution user
    let institutionUser = await User.findOne({ email: 'institution@edumentor.dev' });
    
    if (!institutionUser) {
      console.log('Creating institution user...');
      institutionUser = new User({
        email: 'institution@edumentor.dev',
        password: '$2b$10$example.hash.for.institution.user',
        firstName: 'EduMentor',
        lastName: 'Institution',
        mobile: '+1 (555) 123-4567',
        role: 'institution',
        university: 'EduMentor Technologies',
        isEmailVerified: true,
        isActive: true
      });
      await institutionUser.save();
      console.log('Institution user created');
    }

    // Check if hackathon already exists
    const existingHackathon = await Hackathon.findOne({ 
      title: demoHackathonData.title,
      organizerId: institutionUser._id 
    });

    if (existingHackathon) {
      console.log('Demo hackathon already exists, updating...');
      Object.assign(existingHackathon, demoHackathonData, { organizerId: institutionUser._id });
      await existingHackathon.save();
      console.log('Demo hackathon updated successfully');
    } else {
      console.log('Creating demo hackathon...');
      const hackathon = new Hackathon({
        ...demoHackathonData,
        organizerId: institutionUser._id
      });
      await hackathon.save();
      console.log('Demo hackathon created successfully');
    }

    console.log('Demo hackathon insertion completed');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting demo hackathon:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  insertDemoHackathon();
}

export { insertDemoHackathon };