const mongoose = require('mongoose');
const Transport = require('./models/Transport');
const dotenv = require('dotenv');

dotenv.config();

const seedTransports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Transport.deleteMany(); // Clear existing data

        const d = new Date();
        const futureDate = (days, hours = 0, minutes = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours() + hours, d.getMinutes() + minutes);

        const transports = [
            {
                type: 'flight',
                company: 'SkyHigh Airways',
                from: 'New York',
                to: 'London',
                departureTime: futureDate(1),
                arrivalTime: futureDate(1, 7, 30),
                price: 450,
                seatsAvailable: 120
            },
            {
                type: 'train',
                company: 'FastTrack Rail',
                from: 'Paris',
                to: 'Berlin',
                departureTime: futureDate(2),
                arrivalTime: futureDate(2, 5, 45),
                price: 120,
                seatsAvailable: 300
            },
            {
                type: 'bus',
                company: 'RoadRunner',
                from: 'London',
                to: 'Manchester',
                departureTime: futureDate(3),
                arrivalTime: futureDate(3, 4, 15),
                price: 35,
                seatsAvailable: 50
            },
            {
                type: 'car',
                company: 'Uber',
                from: 'Downtown',
                to: 'Airport',
                departureTime: futureDate(0),
                arrivalTime: futureDate(0, 0, 45),
                price: 45,
                seatsAvailable: 3
            },
            {
                type: 'flight',
                company: 'Oceanic Airlines',
                from: 'Los Angeles',
                to: 'Sydney',
                departureTime: futureDate(5),
                arrivalTime: futureDate(5, 14, 20),
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
