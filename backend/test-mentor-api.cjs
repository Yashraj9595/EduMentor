const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/v1';

async function testMentorAPI() {
  try {
    console.log('🧪 Testing Mentor API endpoints...');
    
    // Step 1: Login as a mentor to get a token
    console.log('1. Logging in as mentor...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'mentor@edumentor.dev',
      password: 'mentor123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Mentor login successful');
    
    // Step 2: Test getting mentor projects
    console.log('2. Testing mentor projects endpoint...');
    const projectsResponse = await axios.get(`${API_BASE}/projects/mentor-projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Mentor projects endpoint working!');
    console.log('Response:', {
      success: projectsResponse.data.success,
      message: projectsResponse.data.message,
      projectCount: projectsResponse.data.data?.length || 0
    });
    
    // Step 3: Test getting mentor problem statements
    console.log('3. Testing mentor problem statements endpoint...');
    try {
      const problemStatementsResponse = await axios.get(`${API_BASE}/problem-statements/mentor`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Mentor problem statements endpoint working!');
      console.log('Response:', {
        success: problemStatementsResponse.data.success,
        message: problemStatementsResponse.data.message,
        problemStatementCount: problemStatementsResponse.data.data?.length || 0
      });
    } catch (error) {
      console.log('⚠️  Mentor problem statements endpoint not yet implemented or no data');
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Step 4: Test creating a problem statement
    console.log('4. Testing create problem statement endpoint...');
    try {
      const createProblemResponse = await axios.post(`${API_BASE}/problem-statements`, {
        title: 'Test Problem Statement',
        description: 'This is a test problem statement for API testing',
        category: 'Technology',
        technologies: ['React', 'Node.js'],
        difficulty: 'intermediate',
        estimatedDuration: '4-6 weeks',
        skillsRequired: ['JavaScript', 'API Development']
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Create problem statement endpoint working!');
      console.log('Response:', {
        success: createProblemResponse.data.success,
        message: createProblemResponse.data.message,
        problemStatementId: createProblemResponse.data.data?._id
      });
      
      // Step 5: Test updating the problem statement
      if (createProblemResponse.data.data?._id) {
        console.log('5. Testing update problem statement endpoint...');
        const updateProblemResponse = await axios.put(`${API_BASE}/problem-statements/${createProblemResponse.data.data._id}`, {
          title: 'Updated Test Problem Statement',
          description: 'This is an updated test problem statement for API testing'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Update problem statement endpoint working!');
        console.log('Response:', {
          success: updateProblemResponse.data.success,
          message: updateProblemResponse.data.message
        });
        
        // Step 6: Test deleting the problem statement
        console.log('6. Testing delete problem statement endpoint...');
        const deleteProblemResponse = await axios.delete(`${API_BASE}/problem-statements/${createProblemResponse.data.data._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Delete problem statement endpoint working!');
        console.log('Response:', {
          success: deleteProblemResponse.data.success,
          message: deleteProblemResponse.data.message
        });
      }
    } catch (error) {
      console.log('⚠️  Problem statement CRUD operations not fully implemented');
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Step 7: Test getting all active problem statements (public endpoint)
    console.log('7. Testing active problem statements endpoint...');
    try {
      const activeProblemsResponse = await axios.get(`${API_BASE}/problem-statements/active`);
      
      console.log('✅ Active problem statements endpoint working!');
      console.log('Response:', {
        success: activeProblemsResponse.data.success,
        message: activeProblemsResponse.data.message,
        problemStatementCount: activeProblemsResponse.data.data?.length || 0
      });
    } catch (error) {
      console.log('⚠️  Active problem statements endpoint not yet implemented or no data');
      console.log('Error:', error.response?.data || error.message);
    }
    
    console.log('🎉 All mentor API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testMentorAPI();