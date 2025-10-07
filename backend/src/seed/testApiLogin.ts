const testApiLogin = async (): Promise<void> => {
  try {
    console.log('🧪 Testing API login endpoint...');
    
    const baseURL = 'http://localhost:5000/api/v1';
    
    // Test admin login
    console.log('🔍 Testing admin login...');
    const adminResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@edumentor.dev',
        password: 'admin123'
      })
    });
    
    const adminData = await adminResponse.json();
    
    if (adminResponse.ok) {
      console.log('✅ Admin login successful!');
      console.log('Response:', {
        success: adminData.success,
        message: adminData.message,
        user: adminData.data?.user,
        hasToken: !!adminData.data?.token
      });
    } else {
      console.log('❌ Admin login failed:', adminData);
    }
    
    // Test student login
    console.log('\n🔍 Testing student login...');
    const studentResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'student@edumentor.dev',
        password: 'student123'
      })
    });
    
    const studentData = await studentResponse.json();
    
    if (studentResponse.ok) {
      console.log('✅ Student login successful!');
      console.log('Response:', {
        success: studentData.success,
        message: studentData.message,
        user: studentData.data?.user,
        hasToken: !!studentData.data?.token
      });
    } else {
      console.log('❌ Student login failed:', studentData);
    }
    
    // Test invalid credentials
    console.log('\n🔍 Testing invalid credentials...');
    const invalidResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@edumentor.dev',
        password: 'wrongpassword'
      })
    });
    
    if (invalidResponse.status === 401) {
      console.log('✅ Invalid credentials correctly rejected (401)');
    } else {
      const invalidData = await invalidResponse.json();
      console.log('❌ Unexpected response:', invalidData);
    }
    
    console.log('\n🎉 API login tests completed successfully!');
    
  } catch (error: any) {
    console.error('❌ API login test failed:', error.message);
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
