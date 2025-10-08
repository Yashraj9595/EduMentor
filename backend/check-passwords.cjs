require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple database connection
async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// User model
const userSchema = new mongoose.Schema({
  email: String,
  password: { type: String, select: true }, // Make sure we can select the password
  firstName: String,
  lastName: String
});

const User = mongoose.model('User', userSchema);

async function checkPasswords() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Checking institution accounts...');
    
    // Check admin account
    const adminUser = await User.findOne({ email: 'admin@university.edu' }).select('+password');
    if (adminUser) {
      console.log('Admin user found:');
      console.log('  Email:', adminUser.email);
      console.log('  Password hash:', adminUser.password);
      console.log('  Password length:', adminUser.password.length);
      
      // Test password verification
      const isMatch = await bcrypt.compare('university123', adminUser.password);
      console.log('  Password verification:', isMatch);
    } else {
      console.log('Admin user not found');
    }
    
    // Check student account
    const studentUser = await User.findOne({ email: 'student1@university.edu' }).select('+password');
    if (studentUser) {
      console.log('\nStudent user found:');
      console.log('  Email:', studentUser.email);
      console.log('  Password hash:', studentUser.password);
      console.log('  Password length:', studentUser.password.length);
      
      // Test password verification
      const isMatch = await bcrypt.compare('student123', studentUser.password);
      console.log('  Password verification:', isMatch);
    } else {
      console.log('Student user not found');
    }
    
    // Check mentor account
    const mentorUser = await User.findOne({ email: 'mentor1@university.edu' }).select('+password');
    if (mentorUser) {
      console.log('\nMentor user found:');
      console.log('  Email:', mentorUser.email);
      console.log('  Password hash:', mentorUser.password);
      console.log('  Password length:', mentorUser.password.length);
      
      // Test password verification
      const isMatch = await bcrypt.compare('mentor123', mentorUser.password);
      console.log('  Password verification:', isMatch);
    } else {
      console.log('Mentor user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

checkPasswords();