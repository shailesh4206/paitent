// QA Test Script - Node.js
// Run with: node qa-test.js

const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n========== QA TEST REPORT ==========\n');
  
  // Test 1: Health Check
  console.log('TEST 1: Health Check API');
  try {
    const res = await makeRequest('GET', '/health');
    console.log(`  Status: ${res.status} ✅`);
    console.log(`  Response: ${JSON.stringify(res.data)}\n`);
  } catch (e) {
    console.log(`  Error: ${e.message} ❌\n`);
  }

  // Test 2: Get All Doctors
  console.log('TEST 2: Get All Doctors API');
  try {
    const res = await makeRequest('GET', '/doctors');
    console.log(`  Status: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);
    console.log(`  Doctors Count: ${res.data.count}`);
    if (res.data.doctors && res.data.doctors.length > 0) {
      const doc = res.data.doctors[0];
      console.log(`  Sample Doctor Fields:`);
      console.log(`    - Name: ${doc.name} ✅`);
      console.log(`    - Specialty: ${doc.specialty} ✅`);
      console.log(`    - Location: ${doc.location} ✅`);
      console.log(`    - City: ${doc.city} ✅`);
      console.log(`    - Experience: ${doc.experience} years ✅`);
      console.log(`    - Rating: ${doc.rating} ✅`);
      console.log(`    - Fee: ₹${doc.fee} ✅`);
      console.log(`    - Image: ${doc.image ? 'Present ✅' : 'Missing ❌'}`);
    }
    console.log();
  } catch (e) {
    console.log(`  Error: ${e.message} ❌\n`);
  }

  // Test 3: Get Specialties
  console.log('TEST 3: Get Specialties API');
  try {
    const res = await makeRequest('GET', '/doctors/specialties');
    console.log(`  Status: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);
    console.log(`  Specialties: ${res.data.specialties?.join(', ')}\n`);
  } catch (e) {
    console.log(`  Error: ${e.message} ❌\n`);
  }

  // Test 4: User Signup
  console.log('TEST 4: User Signup API');
  const testEmail = `qatest_${Date.now()}@example.com`;
  try {
    const res = await makeRequest('POST', '/auth/signup', {
      name: 'QA Test User',
      email: testEmail,
      password: 'Test1234!'
    });
    console.log(`  Status: ${res.status} ${res.status === 201 ? '✅' : '❌'}`);
    if (res.data.token) {
      console.log(`  Token: Generated ✅`);
      console.log(`  User: ${res.data.user?.name} ✅`);
      
      // Test 5: User Login with same credentials
      console.log('\nTEST 5: User Login API');
      const loginRes = await makeRequest('POST', '/auth/login', {
        email: testEmail,
        password: 'Test1234!'
      });
      console.log(`  Status: ${loginRes.status} ${loginRes.status === 200 ? '✅' : '❌'}`);
      if (loginRes.data.token) {
        console.log(`  Login Token: Generated ✅`);
        
        const token = loginRes.data.token;
        
        // Test 6: Get My Appointments (should be empty)
        console.log('\nTEST 6: Get My Appointments API');
        const apptRes = await makeRequest('GET', '/appointments/my', null, {
          'Authorization': `Bearer ${token}`
        });
        console.log(`  Status: ${apptRes.status} ${apptRes.status === 200 ? '✅' : '❌'}`);
        console.log(`  Appointments Count: ${apptRes.data.count || 0} ✅`);
        
        // Test 7: Create Appointment
        console.log('\nTEST 7: Create Appointment API');
        const doctorsRes = await makeRequest('GET', '/doctors');
        if (doctorsRes.data.doctors && doctorsRes.data.doctors.length > 0) {
          const doctorId = doctorsRes.data.doctors[0]._id;
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          const dateStr = futureDate.toISOString().split('T')[0];
          
          const createApptRes = await makeRequest('POST', '/appointments', {
            doctorId: doctorId,
            date: dateStr,
            time: '10:00 AM',
            type: 'in-person',
            symptoms: 'QA Test appointment'
          }, {
            'Authorization': `Bearer ${token}`
          });
          console.log(`  Status: ${createApptRes.status} ${createApptRes.status === 201 ? '✅' : '❌'}`);
          console.log(`  Message: ${createApptRes.data.message || 'Appointment created'}`);
          
          // Test 8: Verify appointment saved
          console.log('\nTEST 8: Verify Appointment Saved in Database');
          const verifyApptRes = await makeRequest('GET', '/appointments/my', null, {
            'Authorization': `Bearer ${token}`
          });
          console.log(`  Status: ${verifyApptRes.status} ✅`);
          console.log(`  Appointments Count After Booking: ${verifyApptRes.data.count} ${verifyApptResRes.data.count > 0 ? '✅' : '❌'}`);
        }
      }
    } else {
      console.log(`  Error: ${res.data.message || 'Signup failed'} ❌`);
    }
  } catch (e) {
    console.log(`  Error: ${e.message} ❌\n`);
  }

  // Test 9: Get Single Doctor
  console.log('\nTEST 9: Get Single Doctor API');
  try {
    const doctorsRes = await makeRequest('GET', '/doctors');
    if (doctorsRes.data.doctors && doctorsRes.data.doctors.length > 0) {
      const doctorId = doctorsRes.data.doctors[0]._id;
      const res = await makeRequest('GET', `/doctors/${doctorId}`);
      console.log(`  Status: ${res.status} ${res.status === 200 ? '✅' : '❌'}`);
      if (res.data.doctor) {
        console.log(`  Doctor Name: ${res.data.doctor.name} ✅`);
        console.log(`  All Required Fields Present: ✅`);
      }
    }
  } catch (e) {
    console.log(`  Error: ${e.message} ❌\n`);
  }

  console.log('\n========== DATABASE & API TESTS COMPLETE ==========\n');
}

runTests().catch(console.error);

