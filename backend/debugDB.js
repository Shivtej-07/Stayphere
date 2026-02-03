const mongoose = require('mongoose');
const Transport = require('./models/Transport');
const dotenv = require('dotenv');

dotenv.config();

const debugTransports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const transports = await Transport.find({});
        console.log('All Transports:', JSON.stringify(transports, null, 2));

        const busTransports = await Transport.find({ type: 'bus' });
        console.log('Bus Transports:', JSON.stringify(busTransports, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugTransports();
