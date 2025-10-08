require('dotenv').config();

const mongoose = require('mongoose');

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
  university: String
});

const User = mongoose.model('User', userSchema);

async function checkInstitutionAccount() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Checking institution role account...');
    
    // Check institution account
    const institutionUser = await User.findOne({ email: 'institution@university.edu' }).select('+password');
    if (institutionUser) {
      console.log('Institution user found:');
      console.log('  Email:', institutionUser.email);
      console.log('  Name:', institutionUser.firstName, institutionUser.lastName);
      console.log('  Role:', institutionUser.role);
      console.log('  University:', institutionUser.university);
      console.log('  Password hash:', institutionUser.password);
    } else {
      console.log('Institution user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

checkInstitutionAccount();