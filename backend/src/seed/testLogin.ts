import mongoose from 'mongoose';
import connectDB from '../config/database';
import { User } from '../models/User';

const testLogin = async (): Promise<void> => {
  try {
    console.log('🧪 Testing login functionality...');
    
    // Connect to database
    await connectDB();
    
    // Test with admin user
    const testEmail = 'admin@edumentor.dev';
    const testPassword = 'admin123';
    
    console.log(`🔍 Testing login for: ${testEmail}`);
    
    // Find user and include password
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified
    });
    
    // Test password comparison
    console.log('🔐 Testing password comparison...');
    const isPasswordValid = await user.comparePassword(testPassword);
    console.log(`Password valid: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password comparison failed');
    }
    
    // Test with different user
    console.log('\n🔍 Testing with student user...');
    const studentEmail = 'student@edumentor.dev';
    const studentPassword = 'student123';
    
    const studentUser = await User.findOne({ email: studentEmail }).select('+password');
    
    if (studentUser) {
      const isStudentPasswordValid = await studentUser.comparePassword(studentPassword);
      console.log(`Student password valid: ${isStudentPasswordValid}`);
    }
    
    console.log('\n✅ Login test completed!');
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testLogin()
    .then(() => {
      console.log('✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export default testLogin;
