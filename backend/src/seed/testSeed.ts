import mongoose from 'mongoose';
import connectDB from '../config/database';
import { User } from '../models/User';

const testSeed = async (): Promise<void> => {
  try {
    console.log('🧪 Testing seed script...');
    
    // Connect to database
    await connectDB();
    
    // Check if users exist
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Get users by role
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📈 Users by role:');
    roleCounts.forEach(role => {
      console.log(`   ${role._id}: ${role.count} users`);
    });
    
    // List all users with their credentials
    const users = await User.find({}, 'email firstName lastName role isActive');
    console.log('\n👥 All users in database:');
    users.forEach(user => {
      console.log(`   ${user.email} (${user.role}) - ${user.firstName} ${user.lastName} - Active: ${user.isActive}`);
    });
    
    console.log('\n✅ Seed test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing seed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testSeed()
    .then(() => {
      console.log('✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export default testSeed;
