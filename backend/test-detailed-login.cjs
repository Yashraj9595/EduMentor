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
  password: { type: String, select: true },
  firstName: String,
  lastName: String,
  role: String,
  university: String,
  isActive: { type: Boolean, default: true }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function testDetailedLogin() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Testing login with institution role account...');
    
    // Find user
    const user = await User.findOne({ email: 'institution@university.edu' }).select('+password');
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:');
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Active:', user.isActive);
    console.log('  Password hash:', user.password);
    
    // Test password comparison
    const isPasswordValid = await user.comparePassword('institution123');
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password verification failed');
      return;
    }
    
    if (!user.isActive) {
      console.log('Account is deactivated');
      return;
    }
    
    console.log('Login would be successful');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

testDetailedLogin();