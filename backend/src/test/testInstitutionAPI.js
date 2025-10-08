// Simple test script to verify institution API endpoints
// This script can be run with: node src/test/testInstitutionAPI.js

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_ADMIN_TOKEN = 'YOUR_ADMIN_JWT_TOKEN_HERE'; // Replace with actual admin token

// Test data
const testStudent = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe.test@example.com',
  mobile: '+1234567890',
  role: 'student',
  university: 'Test University',
  major: 'Computer Science',
  year: '3',
  studentId: 'STU123456',
  graduationYear: '2025'
};

const testMentor = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith.test@example.com',
  mobile: '+1234567891',
  role: 'mentor',
  university: 'Test University',
  major: 'Computer Science'
};

async function testAPI() {
  console.log('Testing Institution API endpoints...\n');
  
  try {
    // Test 1: Create student account
    console.log('1. Testing create student account...');
    const studentResponse = await axios.post(
      `${BASE_URL}/institutions/accounts`,
      testStudent,
      {
        headers: {
          'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('   Student account created:', studentResponse.data.success);
    console.log('   Student ID:', studentResponse.data.data.user.id);
    
    // Test 2: Create mentor account
    console.log('\n2. Testing create mentor account...');
    const mentorResponse = await axios.post(
      `${BASE_URL}/institutions/accounts`,
      testMentor,
      {
        headers: {
          'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('   Mentor account created:', mentorResponse.data.success);
    console.log('   Mentor ID:', mentorResponse.data.data.user.id);
    
    // Test 3: Download template
    console.log('\n3. Testing download template...');
    const templateResponse = await axios.get(
      `${BASE_URL}/institutions/template`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`
        },
        responseType: 'arraybuffer'
      }
    );
    
    console.log('   Template downloaded:', templateResponse.status === 200);
    console.log('   Template size:', templateResponse.data.length, 'bytes');
    
    // Test 4: Get accounts
    console.log('\n4. Testing get accounts...');
    const accountsResponse = await axios.get(
      `${BASE_URL}/institutions/accounts`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_ADMIN_TOKEN}`
        },
        params: {
          limit: 10
        }
      }
    );
    
    console.log('   Accounts retrieved:', accountsResponse.data.success);
    console.log('   Total accounts:', accountsResponse.data.data.pagination.total);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testAPI();