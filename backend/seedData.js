const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Transport = require('./models/Transport');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const destinations = [
    {
        name: 'Paris, France',
        description: 'The City of Light, known for the Eiffel Tower, Louvre Museum, and charming cafes.',
        photos: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'],
        featured: true,
    },
    {
        name: 'Bali, Indonesia',
        description: 'Tropical paradise with beautiful beaches, rice terraces, and vibrant culture.',
        photos: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'],
        featured: true,
    },
    {
        name: 'New York City, USA',
        description: 'The Big Apple, famous for Times Square, Central Park, and Broadway.',
        photos: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'],
        featured: false,
    },
];

const transports = [
    // --- Paris, France ---
    {
        type: 'flight',
        company: 'Air France',
        from: 'London',
        to: 'Paris',
        departureTime: new Date(Date.now() + 86400000), // +1 day
        arrivalTime: new Date(Date.now() + 90000000),
        price: 150,
        seatsAvailable: 100,
        photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'],
    },
    {
        type: 'train',
        company: 'Eurostar',
        from: 'London',
        to: 'Paris',
        departureTime: new Date(Date.now() + 100000000), // +1.x day
        arrivalTime: new Date(Date.now() + 108000000),
        price: 120,
        seatsAvailable: 300,
        photos: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'],
    },
    {
        type: 'bus',
        company: 'FlixBus',
        from: 'Brussels',
        to: 'Paris',
        departureTime: new Date(Date.now() + 172800000), // +2 day
        arrivalTime: new Date(Date.now() + 187200000),
        price: 40,
        seatsAvailable: 50,
        photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
    },

    // --- Bali, Indonesia ---
    {
        type: 'flight',
        company: 'Garuda Indonesia',
        from: 'Sydney',
        to: 'Bali',
        departureTime: new Date(Date.now() + 259200000), // +3 days
        arrivalTime: new Date(Date.now() + 280000000),
        price: 450,
        seatsAvailable: 150,
        photos: ['https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80'],
    },
    {
        type: 'flight',
        company: 'Singleton Air',
        from: 'Singapore',
        to: 'Bali',
        departureTime: new Date(Date.now() + 345600000), // +4 days
        arrivalTime: new Date(Date.now() + 355000000),
        price: 180,
        seatsAvailable: 80,
        photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'],
    },

    // --- New York City, USA ---
    {
        type: 'flight',
        company: 'British Airways',
        from: 'London',
        to: 'New York',
        departureTime: new Date(Date.now() + 432000000), // +5 days
        arrivalTime: new Date(Date.now() + 468000000),
        price: 600,
        seatsAvailable: 200,
        photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'],
    },
    {
        type: 'bus',
        company: 'MegaBus',
        from: 'Boston',
        to: 'New York',
        departureTime: new Date(Date.now() + 86400000), // +1 day
        arrivalTime: new Date(Date.now() + 100000000),
        price: 30,
        seatsAvailable: 45,
        photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
    },
    {
        type: 'train',
        company: 'Amtrak',
        from: 'Washington DC',
        to: 'New York',
        departureTime: new Date(Date.now() + 120000000),
        arrivalTime: new Date(Date.now() + 130000000),
        price: 85,
        seatsAvailable: 120,
        photos: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'],
    },

    // --- Generic / Extra ---
    {
        type: 'flight',
        company: 'Emirates',
        from: 'Dubai',
        to: 'London',
        departureTime: new Date(Date.now() + 500000000),
        arrivalTime: new Date(Date.now() + 540000000),
        price: 700,
        seatsAvailable: 250,
        photos: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'],
    },
];

const seedData = async () => {
    try {
        await Destination.deleteMany();
        await Transport.deleteMany();

        await Destination.insertMany(destinations);
        await Transport.insertMany(transports);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
