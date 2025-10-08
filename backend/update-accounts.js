const mongoose = require('mongoose');
require('dotenv').config();

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor', 'admin', 'institution'], default: 'student' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  isMobileVerified: { type: Boolean, default: false },
  university: { type: String },
  department: { type: String },
  bio: { type: String },
  skills: [{ type: String }],
  linkedin: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yashraj:yashraj123@cluster0.dbwohui.mongodb.net/edumentor?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Update institution account
    const institutionResult = await User.updateOne(
      { email: 'institution@edumentor.dev' },
      { 
        $set: { 
          mobile: '+1234567890',
          updatedAt: new Date()
        }
      }
    );
    console.log('Institution account updated:', institutionResult.modifiedCount > 0);

    // Update mentor account
    const mentorResult = await User.updateOne(
      { email: 'mentor@edumentor.dev' },
      { 
        $set: { 
          mobile: '+1987654321',
          updatedAt: new Date()
        }
      }
    );
    console.log('Mentor account updated:', mentorResult.modifiedCount > 0);

    // Verify accounts
    const institution = await User.findOne({ email: 'institution@edumentor.dev' });
    const mentor = await User.findOne({ email: 'mentor@edumentor.dev' });

    console.log('\n✅ Account Verification:');
    console.log('Institution Account:');
    console.log('  Email:', institution?.email);
    console.log('  Mobile:', institution?.mobile);
    console.log('  Role:', institution?.role);
    
    console.log('\nMentor Account:');
    console.log('  Email:', mentor?.email);
    console.log('  Mobile:', mentor?.mobile);
    console.log('  Role:', mentor?.role);

  } catch (error) {
    console.error('❌ Error updating accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
updateAccounts();
