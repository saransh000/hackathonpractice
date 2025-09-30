const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Helper function to log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to record test result
function recordTest(name, passed, details = '') {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    log(`✅ PASS: ${name}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ FAIL: ${name}`, 'red');
  }
  if (details) {
    log(`   ${details}`, 'cyan');
  }
}

// Wait helper
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testPostAPIs() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     END-TO-END POST API TESTING - HACKATHON HELPER TOOL       ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════╝\n', 'cyan');

  let adminToken = '';
  let userToken = '';
  let newUserId = '';

  try {
    // Test 1: Server Health Check
    log('\n📡 TEST 1: Server Health Check', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const health = await axios.get(`${BASE_URL}/health`);
      recordTest('Server Health Check', health.data.success === true, 
        `Status: ${health.data.message}`);
    } catch (error) {
      recordTest('Server Health Check', false, 
        `Error: ${error.message}`);
      log('\n❌ Server is not running! Please start the backend server.', 'red');
      return;
    }

    await wait(500);

    // Test 2: Admin Login (POST)
    log('\n🔐 TEST 2: POST /api/auth/login (Admin)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const loginData = {
        email: 'admin@hackathon.com',
        password: 'admin123'
      };
      
      log(`Request Body: ${JSON.stringify(loginData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      
      if (response.data.success && response.data.data.token) {
        adminToken = response.data.data.token;
        recordTest('Admin Login', true, 
          `User: ${response.data.data.user.name}, Role: ${response.data.data.user.role}`);
        log(`Token: ${adminToken.substring(0, 30)}...`, 'cyan');
      } else {
        recordTest('Admin Login', false, 'Invalid response structure');
      }
    } catch (error) {
      recordTest('Admin Login', false, 
        `Error: ${error.response?.data?.error || error.message}`);
    }

    await wait(500);

    // Test 3: User Login (POST)
    log('\n👤 TEST 3: POST /api/auth/login (Regular User)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const loginData = {
        email: 'test@example.com',
        password: 'test123'
      };
      
      log(`Request Body: ${JSON.stringify(loginData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      
      if (response.data.success && response.data.data.token) {
        userToken = response.data.data.token;
        recordTest('User Login', true, 
          `User: ${response.data.data.user.name}, Role: ${response.data.data.user.role}`);
        log(`Token: ${userToken.substring(0, 30)}...`, 'cyan');
      } else {
        recordTest('User Login', false, 'Invalid response structure');
      }
    } catch (error) {
      recordTest('User Login', false, 
        `Error: ${error.response?.data?.error || error.message}`);
    }

    await wait(500);

    // Test 4: Invalid Login (POST)
    log('\n🚫 TEST 4: POST /api/auth/login (Invalid Credentials)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const loginData = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };
      
      log(`Request Body: ${JSON.stringify(loginData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
      recordTest('Invalid Login Rejection', false, 
        'Should have rejected invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        recordTest('Invalid Login Rejection', true, 
          'Correctly rejected with 401 Unauthorized');
      } else {
        recordTest('Invalid Login Rejection', false, 
          `Unexpected error: ${error.message}`);
      }
    }

    await wait(500);

    // Test 5: User Registration (POST)
    log('\n✍️ TEST 5: POST /api/auth/register (New User)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const timestamp = Date.now();
      const registerData = {
        name: `Test User ${timestamp}`,
        email: `testuser${timestamp}@example.com`,
        password: 'password123'
      };
      
      log(`Request Body: ${JSON.stringify(registerData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
      
      if (response.data.success && response.data.data.token) {
        newUserId = response.data.data.user.id;
        recordTest('User Registration', true, 
          `Created: ${response.data.data.user.name} (${response.data.data.user.email})`);
        log(`New User ID: ${newUserId}`, 'cyan');
      } else {
        recordTest('User Registration', false, 'Invalid response structure');
      }
    } catch (error) {
      recordTest('User Registration', false, 
        `Error: ${error.response?.data?.error || error.message}`);
    }

    await wait(500);

    // Test 6: Duplicate Email Registration (POST)
    log('\n🔄 TEST 6: POST /api/auth/register (Duplicate Email)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const registerData = {
        name: 'Duplicate User',
        email: 'admin@hackathon.com', // Already exists
        password: 'password123'
      };
      
      log(`Request Body: ${JSON.stringify(registerData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
      recordTest('Duplicate Email Rejection', false, 
        'Should have rejected duplicate email');
    } catch (error) {
      if (error.response?.status === 400) {
        recordTest('Duplicate Email Rejection', true, 
          'Correctly rejected duplicate email with 400 Bad Request');
      } else {
        recordTest('Duplicate Email Rejection', false, 
          `Unexpected error: ${error.message}`);
      }
    }

    await wait(500);

    // Test 7: Password Reset Request (POST)
    log('\n🔐 TEST 7: POST /api/auth/forgot-password', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const resetData = {
        email: 'admin@hackathon.com'
      };
      
      log(`Request Body: ${JSON.stringify(resetData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, resetData);
      
      if (response.data.success) {
        recordTest('Password Reset Request', true, 
          response.data.data || 'Reset email sent');
      } else {
        recordTest('Password Reset Request', false, 'Invalid response');
      }
    } catch (error) {
      recordTest('Password Reset Request', false, 
        `Error: ${error.response?.data?.error || error.message}`);
    }

    await wait(500);

    // Test 8: Create Task (POST) - if endpoint exists
    log('\n📝 TEST 8: POST /api/tasks (Create Task)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const taskData = {
        title: 'End-to-End Test Task',
        description: 'Testing POST API endpoint for task creation',
        status: 'todo',
        priority: 'high'
      };
      
      log(`Request Body: ${JSON.stringify(taskData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/tasks`, taskData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        recordTest('Create Task', true, 
          `Task created: ${response.data.data?.title || 'Task'}`);
      } else {
        recordTest('Create Task', false, 'Invalid response structure');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        recordTest('Create Task', null, 
          'Endpoint not implemented yet (404)');
      } else {
        recordTest('Create Task', false, 
          `Error: ${error.response?.data?.error || error.message}`);
      }
    }

    await wait(500);

    // Test 9: Create Task Without Auth (POST)
    log('\n🚫 TEST 9: POST /api/tasks (Without Authentication)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const taskData = {
        title: 'Unauthorized Task',
        description: 'This should fail',
        status: 'todo'
      };
      
      log(`Request Body: ${JSON.stringify(taskData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/tasks`, taskData);
      recordTest('Unauthorized Task Creation', false, 
        'Should have rejected request without auth');
    } catch (error) {
      if (error.response?.status === 401) {
        recordTest('Unauthorized Task Creation', true, 
          'Correctly rejected with 401 Unauthorized');
      } else if (error.response?.status === 404) {
        recordTest('Unauthorized Task Creation', null, 
          'Endpoint not implemented yet');
      } else {
        recordTest('Unauthorized Task Creation', false, 
          `Unexpected error: ${error.message}`);
      }
    }

    await wait(500);

    // Test 10: Invalid Request Format (POST)
    log('\n❌ TEST 10: POST /api/auth/login (Invalid Format)', 'bright');
    log('─'.repeat(60), 'cyan');
    try {
      const invalidData = {
        invalidField: 'test'
        // Missing required fields
      };
      
      log(`Request Body: ${JSON.stringify(invalidData, null, 2)}`, 'yellow');
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, invalidData);
      recordTest('Invalid Request Format', false, 
        'Should have rejected invalid format');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        recordTest('Invalid Request Format', true, 
          'Correctly rejected invalid format');
      } else {
        recordTest('Invalid Request Format', false, 
          `Unexpected error: ${error.message}`);
      }
    }

    // Summary
    log('\n╔═══════════════════════════════════════════════════════════════╗', 'magenta');
    log('║                      TEST RESULTS SUMMARY                      ║', 'magenta');
    log('╚═══════════════════════════════════════════════════════════════╝\n', 'magenta');
    
    log(`✅ Passed: ${testResults.passed}`, 'green');
    log(`❌ Failed: ${testResults.failed}`, 'red');
    log(`📊 Total: ${testResults.tests.length}`, 'cyan');
    
    const successRate = ((testResults.passed / testResults.tests.length) * 100).toFixed(2);
    log(`\n📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');
    
    // Detailed Results
    log('\n📋 DETAILED TEST RESULTS:', 'bright');
    log('═'.repeat(60), 'cyan');
    testResults.tests.forEach((test, index) => {
      const status = test.passed === null ? '⚠️  SKIP' : test.passed ? '✅ PASS' : '❌ FAIL';
      log(`${index + 1}. ${status}: ${test.name}`, test.passed ? 'green' : test.passed === null ? 'yellow' : 'red');
      if (test.details) {
        log(`   ${test.details}`, 'cyan');
      }
    });
    
    log('\n✅ End-to-end POST API testing complete!\n', 'green');

  } catch (error) {
    log(`\n❌ Critical Error: ${error.message}`, 'red');
    console.error(error);
  }
}

// Run the tests
log('🚀 Starting POST API End-to-End Tests...', 'bright');
log('⏰ Timestamp: ' + new Date().toLocaleString(), 'cyan');
log('🌐 Base URL: ' + BASE_URL + '\n', 'cyan');

testPostAPIs();