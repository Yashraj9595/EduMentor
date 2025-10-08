import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database';
import { User } from '../models/User';
import { UserRole } from '../types';

// Development user data for all roles
const developmentUsers = [
  // Admin users
  {
    email: 'admin@edumentor.dev',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    mobile: '+1234567890',
    role: 'admin' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'superadmin@edumentor.dev',
    password: 'superadmin123',
    firstName: 'Super',
    lastName: 'Admin',
    mobile: '+1234567891',
    role: 'admin' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },

  // Mentor users
  {
    email: 'mentor@edumentor.dev',
    password: 'mentor123',
    firstName: 'John',
    lastName: 'Mentor',
    mobile: '+1234567892',
    role: 'mentor' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'mentor2@edumentor.dev',
    password: 'mentor123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    mobile: '+1234567893',
    role: 'mentor' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'mentor3@edumentor.dev',
    password: 'mentor123',
    firstName: 'Michael',
    lastName: 'Chen',
    mobile: '+1234567894',
    role: 'mentor' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },

  // Student users
  {
    email: 'student@edumentor.dev',
    password: 'student123',
    firstName: 'Alice',
    lastName: 'Student',
    mobile: '+1 (555) 123-4567',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true,
    university: 'University of Technology',
    major: 'Computer Science',
    year: '3rd',
    gpa: '3.75',
    studentId: 'CS2023001',
    graduationYear: '2025',
    bio: 'Passionate computer science student with a focus on web development and AI/ML. Love building innovative projects and collaborating with peers.',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning'],
    interests: ['Web Development', 'AI/ML', 'Data Science', 'Mobile Apps'],
    linkedin: 'https://linkedin.com/in/alice-student',
    github: 'https://github.com/alice-student',
    portfolio: 'https://alice-student.dev'
  },
  {
    email: 'student2@edumentor.dev',
    password: 'student123',
    firstName: 'Bob',
    lastName: 'Wilson',
    mobile: '+1 (555) 234-5678',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true,
    university: 'Tech Institute',
    major: 'Software Engineering',
    year: '2nd',
    gpa: '3.60',
    studentId: 'SE2024002',
    graduationYear: '2026',
    bio: 'Software engineering student passionate about backend development and system architecture.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'AWS'],
    interests: ['Backend Development', 'DevOps', 'Cloud Computing'],
    linkedin: 'https://linkedin.com/in/bob-wilson',
    github: 'https://github.com/bob-wilson'
  },
  {
    email: 'student3@edumentor.dev',
    password: 'student123',
    firstName: 'Emma',
    lastName: 'Davis',
    mobile: '+1 (555) 345-6789',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true,
    university: 'Digital University',
    major: 'Data Science',
    year: '4th',
    gpa: '3.85',
    studentId: 'DS2021003',
    graduationYear: '2024',
    bio: 'Data science student with expertise in machine learning and statistical analysis.',
    skills: ['Python', 'R', 'TensorFlow', 'Pandas', 'SQL'],
    interests: ['Machine Learning', 'Data Visualization', 'Statistics'],
    linkedin: 'https://linkedin.com/in/emma-davis',
    github: 'https://github.com/emma-davis',
    portfolio: 'https://emma-davis.tech'
  },
  {
    email: 'student4@edumentor.dev',
    password: 'student123',
    firstName: 'David',
    lastName: 'Brown',
    mobile: '+1 (555) 456-7890',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true,
    university: 'Innovation College',
    major: 'Cybersecurity',
    year: '3rd',
    gpa: '3.70',
    studentId: 'CS2023004',
    graduationYear: '2025',
    bio: 'Cybersecurity student focused on ethical hacking and network security.',
    skills: ['Python', 'Linux', 'Network Security', 'Ethical Hacking', 'Cryptography'],
    interests: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    linkedin: 'https://linkedin.com/in/david-brown',
    github: 'https://github.com/david-brown'
  },

  // Organizer users
  {
    email: 'organizer@edumentor.dev',
    password: 'organizer123',
    firstName: 'Event',
    lastName: 'Organizer',
    mobile: '+1234567899',
    role: 'organizer' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'organizer2@edumentor.dev',
    password: 'organizer123',
    firstName: 'Conference',
    lastName: 'Manager',
    mobile: '+1234567800',
    role: 'organizer' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },

  // Company users
  {
    email: 'company@edumentor.dev',
    password: 'company123',
    firstName: 'Tech',
    lastName: 'Corp',
    mobile: '+1234567801',
    role: 'company' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'company2@edumentor.dev',
    password: 'company123',
    firstName: 'Innovation',
    lastName: 'Labs',
    mobile: '+1234567802',
    role: 'company' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'company3@edumentor.dev',
    password: 'company123',
    firstName: 'Startup',
    lastName: 'Hub',
    mobile: '+1234567803',
    role: 'company' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  }
];

const seedUsers = async (): Promise<void> => {
  try {
    console.log('🌱 Starting user seeding process...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing users (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared');
    
    // Insert development users one by one to ensure proper password hashing
    console.log('👥 Creating development users...');
    const createdUsers = [];
    
    for (const userData of developmentUsers) {
      try {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error);
      }
    }
    
    console.log(`✅ Successfully created ${createdUsers.length} development users`);
    
    // Display user credentials
    console.log('\n📋 Development User Credentials:');
    console.log('=====================================');
    
    const roleGroups = createdUsers.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {} as Record<string, any[]>);
    
    Object.entries(roleGroups).forEach(([role, users]) => {
      console.log(`\n🔹 ${role.toUpperCase()} USERS:`);
      (users as any[]).forEach(user => {
        const password = developmentUsers.find(u => u.email === user.email)?.password || 'N/A';
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log('   ---');
      });
    });
    
    console.log('\n🎉 User seeding completed successfully!');
    console.log('\n💡 You can now use these credentials to test different user roles in your application.');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✅ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

export default seedUsers;
