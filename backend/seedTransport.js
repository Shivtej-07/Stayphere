const mongoose = require('mongoose');
const Transport = require('./models/Transport');
const dotenv = require('dotenv');

dotenv.config();

const seedTransports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Transport.deleteMany(); // Clear existing data

        const transports = [
            {
                type: 'flight',
                company: 'SkyHigh Airways',
                from: 'New York',
                to: 'London',
                departureTime: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
                arrivalTime: new Date(new Date().setDate(new Date().getDate() + 1)),
                price: 450,
                seatsAvailable: 120
            },
            {
                type: 'train',
                company: 'FastTrack Rail',
                from: 'Paris',
                to: 'Berlin',
                departureTime: new Date(new Date().setDate(new Date().getDate() + 2)),
                arrivalTime: new Date(new Date().setDate(new Date().getDate() + 2)),
                price: 120,
                seatsAvailable: 300
            },
            {
                type: 'bus',
                company: 'RoadRunner',
                from: 'London',
                to: 'Manchester',
                departureTime: new Date(new Date().setDate(new Date().getDate() + 3)),
                arrivalTime: new Date(new Date().setDate(new Date().getDate() + 3)),
                price: 35,
                seatsAvailable: 50
            },
            {
                type: 'car',
                company: 'Uber',
                from: 'Downtown',
                to: 'Airport',
                departureTime: new Date(),
                arrivalTime: new Date(),
                price: 45,
                seatsAvailable: 3
            },
            {
                type: 'flight',
                company: 'Oceanic Airlines',
                from: 'Los Angeles',
                to: 'Sydney',
                departureTime: new Date(new Date().setDate(new Date().getDate() + 5)),
                arrivalTime: new Date(new Date().setDate(new Date().getDate() + 6)),
                price: 850,
                seatsAvailable: 200
            }
        ];

        await Transport.insertMany(transports);
        console.log('Transport data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedTransports();
