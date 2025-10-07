import axios from 'axios';

const testApiLogin = async (): Promise<void> => {
  try {
    console.log('🧪 Testing API login endpoint...');
    
    const baseURL = 'http://localhost:5000/api/v1';
    
    // Test admin login
    console.log('🔍 Testing admin login...');
    const adminResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@edumentor.dev',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Response:', {
      success: adminResponse.data.success,
      message: adminResponse.data.message,
      user: adminResponse.data.data?.user,
      hasToken: !!adminResponse.data.data?.token
    });
    
    // Test student login
    console.log('\n🔍 Testing student login...');
    const studentResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'student@edumentor.dev',
      password: 'student123'
    });
    
    console.log('✅ Student login successful!');
    console.log('Response:', {
      success: studentResponse.data.success,
      message: studentResponse.data.message,
      user: studentResponse.data.data?.user,
      hasToken: !!studentResponse.data.data?.token
    });
    
    // Test invalid credentials
    console.log('\n🔍 Testing invalid credentials...');
    try {
      await axios.post(`${baseURL}/auth/login`, {
        email: 'admin@edumentor.dev',
        password: 'wrongpassword'
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid credentials correctly rejected (401)');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }
    
    console.log('\n🎉 API login tests completed successfully!');
    
  } catch (error: any) {
    console.error('❌ API login test failed:', error.response?.data || error.message);
    throw error;
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testApiLogin()
    .then(() => {
      console.log('✅ API test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ API test failed:', error);
      process.exit(1);
    });
}

export default testApiLogin;
