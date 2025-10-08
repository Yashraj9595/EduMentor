const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...');
    
    // Step 1: Login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'student@edumentor.dev',
      password: 'student123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Test the projects explore endpoint
    console.log('2. Testing projects explore endpoint...');
    const projectsResponse = await axios.get(`${API_BASE}/projects/explore?limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Projects endpoint working!');
    console.log('Response:', {
      success: projectsResponse.data.success,
      message: projectsResponse.data.message,
      projectCount: projectsResponse.data.data?.length || 0
    });
    
    // Step 3: Test debug endpoint
    console.log('3. Testing debug endpoint...');
    const debugResponse = await axios.get(`${API_BASE}/projects/debug`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Debug endpoint working!');
    console.log('Debug data:', debugResponse.data.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
