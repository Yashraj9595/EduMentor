import mongoose from 'mongoose';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';
import connectDB from '../config/database';

const verifyDemoHackathon = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find institution user
    const institutionUser = await User.findOne({ email: 'institution@edumentor.dev' });
    if (!institutionUser) {
      console.log('❌ Institution user not found');
      return;
    }
    console.log('✅ Institution user found:', institutionUser.email);

    // Find demo hackathon
    const hackathon = await Hackathon.findOne({ 
      title: 'EduMentor Innovation Challenge 2024',
      organizerId: institutionUser._id 
    });

    if (!hackathon) {
      console.log('❌ Demo hackathon not found');
      return;
    }

    console.log('✅ Demo hackathon found:');
    console.log('   Title:', hackathon.title);
    console.log('   Status:', hackathon.status);
    console.log('   Start Date:', hackathon.startDate);
    console.log('   End Date:', hackathon.endDate);
    console.log('   Location:', hackathon.location);
    console.log('   Max Teams:', hackathon.maxTeams);
    console.log('   Prize Pool:', hackathon.prizePool);
    console.log('   Tags:', hackathon.tags.join(', '));
    console.log('   Categories:', hackathon.categories.join(', '));
    console.log('   Prizes:', hackathon.prizes.length);
    console.log('   Sponsors:', hackathon.sponsors.length);
    console.log('   Mentors:', hackathon.mentors.length);
    console.log('   Resources:', hackathon.resources.length);
    console.log('   Submission Stages:', hackathon.submissionStages.length);
    console.log('   Volunteers:', hackathon.volunteers.length);
    console.log('   Rules:', hackathon.rules.length);

    console.log('\n🎉 Demo hackathon verification completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying demo hackathon:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  verifyDemoHackathon();
}

export { verifyDemoHackathon };
