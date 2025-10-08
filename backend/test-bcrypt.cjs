const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    console.log('Testing bcrypt...');
    
    // Hash a password
    const password = 'university123';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    
    // Verify the password
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password match:', isMatch);
    
    // Test with wrong password
    const isMatchWrong = await bcrypt.compare('wrongpassword', hashedPassword);
    console.log('Wrong password match:', isMatchWrong);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testBcrypt();