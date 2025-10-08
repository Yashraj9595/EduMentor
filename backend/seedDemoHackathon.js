const { exec } = require('child_process');
const path = require('path');

console.log('🌱 Creating demo hackathon...');

// Run the TypeScript file
exec('npx ts-node src/seed/demoHackathon.ts', { cwd: path.join(__dirname) }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running demo hackathon script:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Warning:', stderr);
  }
  
  console.log('✅ Demo hackathon creation output:');
  console.log(stdout);
  console.log('\n🎉 Demo hackathon created successfully!');
  console.log('📧 Organizer: mentor@edumentor.dev');
  console.log('🏆 Hackathon: EduMentor AI Innovation Challenge 2024');
});
