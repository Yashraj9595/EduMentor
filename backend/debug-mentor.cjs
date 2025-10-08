const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function debugMentor() {
  try {
    console.log('Debugging mentor functionality...');
    
    // Login as a mentor to get a token
    console.log('1. Logging in as mentor...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'mentor@edumentor.dev',
      password: 'mentor123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Mentor login successful');
    
    // Test getting mentor profile
    console.log('2. Testing user profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('User profile:', profileResponse.data);
    
    // Test getting mentor projects
    console.log('3. Testing mentor projects endpoint...');
    const projectsResponse = await axios.get(`${API_BASE}/projects/mentor-projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Projects response:', projectsResponse.data);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.response?.data || error.message);
  }
}

debugMentor();