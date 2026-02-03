const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const dotenv = require('dotenv');

dotenv.config();

const checkDestinations = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const destinations = await Destination.find({});
        destinations.forEach(d => {
            console.log(`ID: ${d._id}`);
            console.log(`Name: ${d.name}`);
            console.log(`Photos: ${d.photos.map(p => p.length > 50 ? p.substring(0, 50) + '...' : p)}`);
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDestinations();
