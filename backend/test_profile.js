const fetch = require('node-fetch');

async function testProfileApi() {
    console.log("1. Logging in...");
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admintest@example.com', password: 'password123' })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success) {
        console.error("Login failed:", loginData);
        return;
    }
    
    console.log("Login successful. Token acquired.");
    const token = loginData.token;

    console.log("\n2. Fetching Profile...");
    const meRes = await fetch('http://127.0.0.1:5000/api/auth/me', {
       headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Get Profile Status:", meRes.status);
    console.log("Get Profile Data:", await meRes.json());
    
    console.log("\n3. Updating Profile...");
    
    // Create FormData equivalent for node
    const formData = new URLSearchParams();
    formData.append('username', 'admintest_updated');
    formData.append('email', 'admintest_updated@example.com');

    const updateRes = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: formData
    });
    
    console.log("Update Profile Status:", updateRes.status);
    const responseText = await updateRes.text();
    console.log("Update Profile Data (RAW):", responseText);
}

testProfileApi();
