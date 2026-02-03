const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const testAddDestination = async () => {
    try {
        // 1. Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admintest@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login successful, token obtained.');

        // 2. Try to add destination
        const payload = {
            name: 'Test Dest',
            description: 'Test Desc',
            featured: false,
            photos: [''] // Simulate splitting empty string
        };

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post('http://localhost:5000/api/destinations', payload, config);
        console.log('Destination added:', res.data);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

testAddDestination();
