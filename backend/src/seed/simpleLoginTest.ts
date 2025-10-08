import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('Testing login...');
    
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'institution@university.edu',
      password: 'institution123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.log('Login failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

testLogin();