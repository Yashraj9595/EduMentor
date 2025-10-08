const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

async function createMentorAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yashraj:yashraj123@cluster0.dbwohui.mongodb.net/edumentor?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Mentor account details
    const mentorData = {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'mentor@edumentor.dev',
      password: 'Mentor123!',
      mobile: '+1987654321',
      role: 'mentor',
      isActive: true,
      isEmailVerified: true,
      isMobileVerified: true,
      university: 'Stanford University',
      department: 'Computer Science',
      bio: 'Specialized in artificial intelligence and machine learning with 10+ years of industry experience.',
      skills: ['AI', 'Machine Learning', 'Data Science', 'Python', 'TensorFlow'],
      linkedin: 'https://linkedin.com/in/sarahjohnson'
    };

    // Check if mentor already exists
    const existingMentor = await User.findOne({ email: mentorData.email });
    if (existingMentor) {
      console.log('Mentor account already exists:', existingMentor.email);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(mentorData.password, saltRounds);
    mentorData.password = hashedPassword;

    // Create mentor user
    const mentor = new User(mentorData);
    await mentor.save();

    console.log('✅ Mentor account created successfully!');
    console.log('📧 Email:', mentorData.email);
    console.log('🔑 Password:', 'Mentor123!');
    console.log('👤 Role:', mentorData.role);
    console.log('🏫 University:', mentorData.university);

  } catch (error) {
    console.error('❌ Error creating mentor account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createMentorAccount();
