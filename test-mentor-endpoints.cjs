const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api/v1';
let authToken = '';

// Test user credentials (from DEVELOPMENT_USERS.md)
const TEST_MENTOR = {
  email: 'mentor@edumentor.dev',
  password: 'mentor123'
};

async function login() {
  try {
    console.log('🔐 Logging in as mentor...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_MENTOR.email,
      password: TEST_MENTOR.password
    });
    
    authToken = response.data.data.token;
    console.log('✅ Login successful');
    console.log('👤 User ID:', response.data.data.user.id);
    console.log('🎭 Role:', response.data.data.user.role);
    return response.data.data.user;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function testProfileEndpoint(user) {
  try {
    console.log('\n👤 Testing profile endpoint...');
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Profile endpoint working');
    console.log('📋 Profile data:', {
      id: response.data.data.user._id,
      email: response.data.data.user.email,
      firstName: response.data.data.user.firstName,
      lastName: response.data.data.user.lastName,
      role: response.data.data.user.role
    });
  } catch (error) {
    console.error('❌ Profile endpoint failed:', error.response?.data || error.message);
  }
}

async function testMentorProjectsEndpoint() {
  try {
    console.log('\n📚 Testing mentor projects endpoint...');
    const response = await axios.get(`${BASE_URL}/projects/mentor-projects`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Mentor projects endpoint working');
    console.log('📊 Found projects:', response.data.data.length);
  } catch (error) {
    console.error('❌ Mentor projects endpoint failed:', error.response?.data || error.message);
  }
}

async function testProblemStatementsEndpoint() {
  try {
    console.log('\n📝 Testing problem statements endpoint...');
    const response = await axios.get(`${BASE_URL}/problem-statements/mentor`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Problem statements endpoint working');
    console.log('📊 Found problem statements:', response.data.data.length);
  } catch (error) {
    console.error('❌ Problem statements endpoint failed:', error.response?.data || error.message);
  }
}

async function testMentorsEndpoint() {
  try {
    console.log('\n👨‍🏫 Testing mentors endpoint...');
    const response = await axios.get(`${BASE_URL}/users/mentors`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Mentors endpoint working');
    console.log('📊 Found mentors:', response.data.data.length);
  } catch (error) {
    console.error('❌ Mentors endpoint failed:', error.response?.data || error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting mentor endpoints test suite...\n');
  
  try {
    // Login first
    const user = await login();
    
    // Run all tests
    await testProfileEndpoint(user);
    await testMentorProjectsEndpoint();
    await testProblemStatementsEndpoint();
    await testMentorsEndpoint();
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runAllTests();