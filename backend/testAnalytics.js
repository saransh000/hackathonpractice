const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// You'll need to get an admin token first
// For testing, let's use the admin credentials from your database
const testAnalytics = async () => {
  try {
    console.log('🔐 Step 1: Logging in as admin...\n');
    
    // Login as admin first - admin@hackathon.com with password: admin123
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@hackathon.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    console.log('Token:', token.substring(0, 20) + '...\n');
    
    // Set up headers with token
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log('📊 Step 2: Fetching Task Analytics...\n');
    const taskAnalytics = await axios.get(`${BASE_URL}/api/admin/analytics/tasks`, config);
    console.log('=== TASK ANALYTICS ===');
    console.log(JSON.stringify(taskAnalytics.data, null, 2));
    console.log('\n');
    
    console.log('📋 Step 3: Fetching Board Analytics...\n');
    const boardAnalytics = await axios.get(`${BASE_URL}/api/admin/analytics/boards`, config);
    console.log('=== BOARD ANALYTICS ===');
    console.log(JSON.stringify(boardAnalytics.data, null, 2));
    console.log('\n');
    
    console.log('💻 Step 4: Fetching System Analytics...\n');
    const systemAnalytics = await axios.get(`${BASE_URL}/api/admin/analytics/system`, config);
    console.log('=== SYSTEM ANALYTICS ===');
    console.log(JSON.stringify(systemAnalytics.data, null, 2));
    console.log('\n');
    
    console.log('✅ All analytics fetched successfully!');
    
  } catch (error) {
    console.error('❌ Error occurred!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Is the server running on', BASE_URL, '?');
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAnalytics();
