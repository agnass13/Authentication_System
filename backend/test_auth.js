import http from 'http';
import { dbGet, initDatabase } from './database/db.js';
import app from './server.js'; // Note: server starts on import

// Simple helper to send JSON HTTP requests
function sendRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- 🧪 STARTING AUTHENTICATION INTEGRATION SUITE ---');
  // Wait 1.5 seconds for server to be fully ready
  await new Promise((r) => setTimeout(r, 1500));

  const testEmail = `student_${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';
  let authToken = '';

  try {
    // Test 1: Register new user
    console.log('\n[Test 1] POST /api/auth/register (Valid User)');
    const regRes = await sendRequest('POST', '/api/auth/register', {
      name: 'John Doe',
      email: testEmail,
      password: testPassword,
    });
    console.log('Status:', regRes.status);
    console.log('Response:', regRes.body);
    if (regRes.status !== 201 || !regRes.body.token) {
      throw new Error('Test 1 Failed: Registration should return 201 and token');
    }
    authToken = regRes.body.token;
    console.log('✅ Test 1 Passed: User registered successfully.');

    // Test 2: Duplicate email registration
    console.log('\n[Test 2] POST /api/auth/register (Duplicate Email)');
    const dupRes = await sendRequest('POST', '/api/auth/register', {
      name: 'Duplicate John',
      email: testEmail,
      password: testPassword,
    });
    console.log('Status:', dupRes.status);
    console.log('Response:', dupRes.body);
    if (dupRes.status !== 409) {
      throw new Error('Test 2 Failed: Duplicate email should return 409');
    }
    console.log('✅ Test 2 Passed: Duplicate email rejected correctly.');

    // Test 3: Password Hash in SQLite (Never plain text)
    console.log('\n[Test 3] SQLite Database Hash Verification');
    const dbRow = await dbGet('SELECT * FROM users WHERE email = ?', [testEmail]);
    console.log('Stored DB Record:', {
      id: dbRow.id,
      name: dbRow.name,
      email: dbRow.email,
      password_hash: dbRow.password_hash.substring(0, 15) + '...',
      created_at: dbRow.created_at,
    });
    if (!dbRow.password_hash.startsWith('$2a$') && !dbRow.password_hash.startsWith('$2b$')) {
      throw new Error('Test 3 Failed: Password is not hashed with bcrypt!');
    }
    if (dbRow.password_hash === testPassword) {
      throw new Error('Test 3 Failed: Password was saved in plain-text!');
    }
    console.log('✅ Test 3 Passed: Password is confirmed to be securely bcrypt-hashed.');

    // Test 4: Login with correct password
    console.log('\n[Test 4] POST /api/auth/login (Correct Credentials)');
    const loginRes = await sendRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });
    console.log('Status:', loginRes.status);
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Test 4 Failed: Login should return 200 and token');
    }
    console.log('✅ Test 4 Passed: Login succeeded.');

    // Test 5: Login with incorrect password
    console.log('\n[Test 5] POST /api/auth/login (Wrong Password)');
    const wrongPassRes = await sendRequest('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword999',
    });
    console.log('Status:', wrongPassRes.status);
    if (wrongPassRes.status !== 401) {
      throw new Error('Test 5 Failed: Wrong password should return 401');
    }
    console.log('✅ Test 5 Passed: Incorrect password rejected with 401.');

    // Test 6: Verify Protected Route /api/auth/me
    console.log('\n[Test 6] GET /api/auth/me (Authenticated Session)');
    const meRes = await sendRequest('GET', '/api/auth/me', null, authToken);
    console.log('Status:', meRes.status);
    console.log('User Profile:', meRes.body);
    if (meRes.status !== 200 || meRes.body.user.email !== testEmail) {
      throw new Error('Test 6 Failed: Protected /api/auth/me failed');
    }
    console.log('✅ Test 6 Passed: Protected user profile fetched.');

    // Test 7: System Health and Schema Inspection
    console.log('\n[Test 7] GET /api/auth/health (Database & System Inspection)');
    const healthRes = await sendRequest('GET', '/api/auth/health');
    console.log('Status:', healthRes.status);
    console.log('Health info:', healthRes.body);
    if (healthRes.status !== 200 || !healthRes.body.database) {
      throw new Error('Test 7 Failed: Health endpoint failed');
    }
    console.log('✅ Test 7 Passed: System health verified.');

    console.log('\n🎉 ALL 7 INTEGRATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite error:', err);
    process.exit(1);
  }
}

runTests();
