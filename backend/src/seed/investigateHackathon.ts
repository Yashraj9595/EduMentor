import mongoose from 'mongoose';
import { Hackathon } from '../models/Hackathon';
import { User } from '../models/User';
import connectDB from '../config/database';

const investigateHackathon = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔍 Investigating hackathon created by institution@edumentor.dev...\n');

    // Find institution user
    const institutionUser = await User.findOne({ email: 'institution@edumentor.dev' });
    if (!institutionUser) {
      console.log('❌ Institution user not found');
      return;
    }
    console.log('✅ Institution user found:');
    console.log('   ID:', institutionUser._id);
    console.log('   Email:', institutionUser.email);
    console.log('   Name:', institutionUser.firstName, institutionUser.lastName);
    console.log('   Role:', institutionUser.role);
    console.log('   University:', institutionUser.university);
    console.log('   Active:', institutionUser.isActive);
    console.log('   Email Verified:', institutionUser.isEmailVerified);
    console.log('   Created:', institutionUser.createdAt);
    console.log('');

    // Find all hackathons by this institution
    const hackathons = await Hackathon.find({ organizerId: institutionUser._id })
      .populate('organizerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log(`📊 Found ${hackathons.length} hackathon(s) created by this institution:\n`);

    hackathons.forEach((hackathon, index) => {
      console.log(`🏆 Hackathon #${index + 1}:`);
      console.log('   ID:', hackathon._id);
      console.log('   Title:', hackathon.title);
      console.log('   Status:', hackathon.status);
      console.log('   Organizer:', (hackathon.organizerId as any).firstName, (hackathon.organizerId as any).lastName);
      console.log('   Created:', hackathon.createdAt);
      console.log('   Updated:', hackathon.updatedAt);
      console.log('   Start Date:', hackathon.startDate);
      console.log('   End Date:', hackathon.endDate);
      console.log('   Location:', hackathon.location);
      console.log('   Location Type:', hackathon.locationType);
      console.log('   Max Teams:', hackathon.maxTeams);
      console.log('   Team Size:', hackathon.minTeamSize, '-', hackathon.maxTeamSize);
      console.log('   Prize Pool:', hackathon.prizePool, hackathon.currency);
      console.log('   Participants:', hackathon.participants);
      console.log('   Teams:', hackathon.teams);
      console.log('   Difficulty:', hackathon.difficulty);
      console.log('   Tags:', hackathon.tags.join(', '));
      console.log('   Categories:', hackathon.categories.join(', '));
      console.log('   Rules Count:', hackathon.rules.length);
      console.log('   Prizes Count:', hackathon.prizes.length);
      console.log('   Sponsors Count:', hackathon.sponsors.length);
      console.log('   Mentors Count:', hackathon.mentors.length);
      console.log('   Resources Count:', hackathon.resources.length);
      console.log('   Submission Stages Count:', hackathon.submissionStages.length);
      console.log('   Volunteers Count:', hackathon.volunteers.length);
      console.log('   Registrations Count:', hackathon.registrations?.length || 0);
      console.log('   Submissions Count:', hackathon.submissions?.length || 0);
      console.log('');

      // Detailed breakdown
      console.log('📋 Detailed Information:');
      console.log('   Description:', hackathon.description.substring(0, 100) + '...');
      console.log('   Short Description:', hackathon.shortDescription);
      console.log('   Registration Start:', hackathon.registrationStart);
      console.log('   Registration End:', hackathon.registrationEnd);
      console.log('   Submission Deadline:', hackathon.submissionDeadline);
      console.log('');

      // Requirements
      console.log('📝 Requirements:');
      Object.entries(hackathon.requirements).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      console.log('');

      // Judging Criteria
      console.log('⚖️ Judging Criteria:');
      Object.entries(hackathon.judgingCriteria).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}%`);
      });
      console.log('');

      // Prizes
      console.log('🏆 Prizes:');
      hackathon.prizes.forEach((prize, prizeIndex) => {
        console.log(`   ${prizeIndex + 1}. ${prize.position}: ${prize.amount} - ${prize.description}`);
      });
      console.log('');

      // Sponsors
      console.log('🤝 Sponsors:');
      hackathon.sponsors.forEach((sponsor, sponsorIndex) => {
        console.log(`   ${sponsorIndex + 1}. ${sponsor.name} (${sponsor.tier}) - ${sponsor.description}`);
      });
      console.log('');

      // Mentors
      console.log('👨‍🏫 Mentors:');
      hackathon.mentors.forEach((mentor, mentorIndex) => {
        console.log(`   ${mentorIndex + 1}. ${mentor.name} - ${mentor.expertise.join(', ')}`);
      });
      console.log('');

      // Resources
      console.log('📚 Resources:');
      hackathon.resources.forEach((resource, resourceIndex) => {
        console.log(`   ${resourceIndex + 1}. ${resource.title} (${resource.type}) - ${resource.description}`);
      });
      console.log('');

      // Submission Stages
      console.log('🔄 Submission Stages:');
      hackathon.submissionStages.forEach((stage, stageIndex) => {
        console.log(`   ${stageIndex + 1}. ${stage.name} (${stage.type}) - ${stage.date}`);
        console.log(`      Description: ${stage.description}`);
        console.log(`      Requirements: ${stage.requirements.join(', ')}`);
      });
      console.log('');

      // Volunteers
      console.log('🤝 Volunteers:');
      hackathon.volunteers.forEach((volunteer, volunteerIndex) => {
        console.log(`   ${volunteerIndex + 1}. ${volunteer.name} (${volunteer.role}) - ${volunteer.expertise.join(', ')}`);
      });
      console.log('');

      // Contact Info
      console.log('📞 Contact Information:');
      console.log('   Email:', hackathon.contactInfo.email);
      console.log('   Phone:', hackathon.contactInfo.phone);
      console.log('   Website:', hackathon.contactInfo.website);
      console.log('   Social Media:');
      Object.entries(hackathon.contactInfo.socialMedia).forEach(([platform, url]) => {
        if (url) console.log(`     ${platform}: ${url}`);
      });
      console.log('');

      // Rules
      console.log('📋 Rules:');
      hackathon.rules.forEach((rule, ruleIndex) => {
        console.log(`   ${ruleIndex + 1}. ${rule}`);
      });
      console.log('');

      console.log('='.repeat(80));
      console.log('');
    });

    // Summary
    console.log('📊 SUMMARY:');
    console.log(`   Total Hackathons: ${hackathons.length}`);
    console.log(`   Published: ${hackathons.filter(h => h.status === 'published').length}`);
    console.log(`   Draft: ${hackathons.filter(h => h.status === 'draft').length}`);
    console.log(`   Active: ${hackathons.filter(h => h.status === 'active').length}`);
    console.log(`   Completed: ${hackathons.filter(h => h.status === 'completed').length}`);
    console.log(`   Cancelled: ${hackathons.filter(h => h.status === 'cancelled').length}`);

    console.log('\n🎉 Investigation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error investigating hackathon:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  investigateHackathon();
}

export { investigateHackathon };
