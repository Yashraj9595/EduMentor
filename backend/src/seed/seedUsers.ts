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
    mobile: '+1234567895',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'student2@edumentor.dev',
    password: 'student123',
    firstName: 'Bob',
    lastName: 'Wilson',
    mobile: '+1234567896',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'student3@edumentor.dev',
    password: 'student123',
    firstName: 'Emma',
    lastName: 'Davis',
    mobile: '+1234567897',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
  },
  {
    email: 'student4@edumentor.dev',
    password: 'student123',
    firstName: 'David',
    lastName: 'Brown',
    mobile: '+1234567898',
    role: 'student' as UserRole,
    isEmailVerified: true,
    isMobileVerified: true,
    isActive: true
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
