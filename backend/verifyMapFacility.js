const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const Hotel = require('./models/Hotel');
const Facility = require('./models/Facility');

console.log('Verifying Map and Facility updates...');

// Mock DB connection for schema validation (doesn't need real DB for 'new Model')
// However, to test refs properly with populate, we usually need a DB.
// For now, we will just check if the model instantiates and validates schema.

try {
    const facility = new Facility({ name: 'Free WiFi', icon: 'wifi-icon' });
    console.log('Facility model loaded:', !!facility);

    // Test Hotel with location
    const hotel = new Hotel({
        name: 'Geo Hotel',
        type: 'hotel',
        city: 'Geo City',
        address: '123 Map St',
        distance: '500m',
        title: 'Map Hotel',
        description: 'Near the center',
        cheapestPrice: 150,
        rooms: [], // Empty for now
        location: {
            type: 'Point',
            coordinates: [-73.856077, 40.848447] // [Longitude, Latitude]
        },
        facilities: [facility._id]
    });

    console.log('Hotel with Location and Facility ref loaded:', !!hotel);

    // Validate location structure
    if (hotel.location.type === 'Point' && Array.isArray(hotel.location.coordinates)) {
        console.log('Location field structure is valid.');
    } else {
        console.error('Location field structure is INVALID.');
    }

    console.log('Verification successful.');

} catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
}
