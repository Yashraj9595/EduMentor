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

async function createInstitutionAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yashraj:yashraj123@cluster0.dbwohui.mongodb.net/edumentor?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Institution account details
    const institutionData = {
      firstName: 'EduMentor',
      lastName: 'Institution',
      email: 'institution@edumentor.dev',
      password: 'Institution123!',
      mobile: '+1234567890',
      role: 'institution',
      isActive: true,
      isEmailVerified: true,
      isMobileVerified: true,
      university: 'EduMentor University',
      department: 'Administration',
      bio: 'Official EduMentor Institution Account for managing educational programs and student projects.',
      skills: ['Education Management', 'Student Support', 'Project Coordination'],
      linkedin: 'https://linkedin.com/company/edumentor'
    };

    // Check if institution already exists
    const existingInstitution = await User.findOne({ email: institutionData.email });
    if (existingInstitution) {
      console.log('Institution account already exists:', existingInstitution.email);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(institutionData.password, saltRounds);
    institutionData.password = hashedPassword;

    // Create institution user
    const institution = new User(institutionData);
    await institution.save();

    console.log('✅ Institution account created successfully!');
    console.log('📧 Email:', institutionData.email);
    console.log('🔑 Password:', 'Institution123!');
    console.log('👤 Role:', institutionData.role);
    console.log('🏫 University:', institutionData.university);

  } catch (error) {
    console.error('❌ Error creating institution account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createInstitutionAccount();
