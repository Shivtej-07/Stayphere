const http = require('http');
const fs = require('fs');

const API_HOST = 'localhost';
const API_PORT = 5000;
const API_PATH = '/api/destinations';

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Failed to parse JSON response'));
                    }
                } else {
                    reject(new Error(`Request failed with status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
}

async function verify() {
    try {
        console.log('Fetching all destinations...');
        const destinations = await makeRequest(API_PATH);

        if (!destinations || destinations.length === 0) {
            console.error('No destinations found.');
            process.exit(1);
        }

        console.log(`Found ${destinations.length} destinations.`);

        fs.writeFileSync('debug_destinations.json', JSON.stringify(destinations, null, 2));
        console.log('Destinations written to debug_destinations.json');

    } catch (error) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
}

verify();
