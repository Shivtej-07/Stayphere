const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Transport = require('./models/Transport');
const connectDB = require('./config/db');

dotenv.config();

const seedIndiaContent = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for Seeding India Content');

        await Destination.deleteMany({});
        await Transport.deleteMany({});

        // --- Indian Temples (Destinations) ---
        // Using high-quality, verified Unsplash source URLs
        const destinations = [
            // Global Defaults
            {
                name: 'Paris, France',
                description: 'The City of Light, known for the Eiffel Tower, Louvre Museum, and charming cafes.',
                photos: [
                    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1499856871940-a09c27bab909?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Bali, Indonesia',
                description: 'Tropical paradise with beautiful beaches, rice terraces, and vibrant culture.',
                photos: [
                    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'New York City, USA',
                description: 'The Big Apple, famous for Times Square, Central Park, and Broadway.',
                photos: [
                    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
            },
            // Indian Destinations with Real Images
            {
                name: 'Kedarnath Temple, Uttarakhand',
                description: 'One of the most sacred Hindu temples dedicated to Lord Shiva, located in the Garhwal Himalayas.',
                photos: [
                    'https://images.unsplash.com/photo-1616859353916-2c938c5c7d0e?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590455088258-20a2298c5545?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1589136709833-286a11e1f544?auto=format&fit=crop&w=800&q=80', // Snowy mountains
                    'https://images.unsplash.com/photo-1605626245053-29472ee9180c?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Badrinath Temple, Uttarakhand',
                description: 'Dedicated to Lord Vishnu, Badrinath is a major pilgrimage site and part of the Char Dham.',
                photos: [
                    'https://images.unsplash.com/photo-1624694406248-2621a644f807?auto=format&fit=crop&w=800&q=80', // Better Badrinath representation
                    'https://images.unsplash.com/photo-1626245199613-207d58933bc6?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1517524953934-2e947d1a58df?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1571597437877-0335eef77a28?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Golden Temple, Amritsar',
                description: 'The holiest Gurdwara of Sikhism, also known as Sri Harmandir Sahib.',
                photos: [
                    'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1582236873539-75618b26b3e1?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1628151016629-6705d8349756?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1634629377473-82f534fd779c?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Tirupati Balaji, Andhra Pradesh',
                description: 'A landmark Vaishnavite temple dedicated to Lord Venkateswara.',
                photos: [
                    'https://images.unsplash.com/photo-1623945934149-d7c813735164?auto=format&fit=crop&w=800&q=80', // Replaced Google Share link
                    'https://images.unsplash.com/photo-1605626245053-29472ee9180c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1643261962363-222eb6139cd3?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1598555230912-143714652277?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Rameswaram Temple, Tamil Nadu',
                description: 'A Hindu temple dedicated to the god Shiva located on Rameswaram island.',
                photos: [
                    'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1605626245053-29472ee9180c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1582555696516-7243c4ae5f86?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590455088258-20a2298c5545?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Konark Sun Temple, Odisha',
                description: 'A 13th-century CE Sun Temple at Konark, dedicated to the Hindu sun god Surya.',
                photos: [
                    'https://images.unsplash.com/photo-1598207951491-255eaf13b376?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1628151016023-b1d5c22502c3?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1624694406248-2621a644f807?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
            },
            // NEWLY ADDED TEMPLES
            {
                name: 'Meenakshi Amman Temple, Madurai',
                description: 'A historic Hindu temple located on the southern bank of the Vaigai River.',
                photos: [
                    'https://images.unsplash.com/photo-1644302258836-8aed59937172?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1589136709833-286a11e1f544?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1582236873539-75618b26b3e1?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Virupaksha Temple, Hampi',
                description: 'Part of the Group of Monuments at Hampi, designated as a UNESCO World Heritage Site.',
                photos: [
                    'https://images.unsplash.com/photo-1600100598004-94b29bb64525?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1623945934149-d7c813735164?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1605626245053-29472ee9180c?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Prem Mandir, Vrindavan',
                description: 'A massive temple complex related to Radha Krishna and Sita Ram.',
                photos: [
                    'https://images.unsplash.com/photo-1678788931557-ca5e7f0c4515?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1598555230912-143714652277?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1571597437877-0335eef77a28?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
            },
            {
                name: 'Somnath Temple, Gujarat',
                description: 'The first among the twelve Jyotirlinga shrines of Shiva.',
                photos: [
                    'https://images.unsplash.com/photo-1628522384964-b81628d01d4a?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590455088258-20a2298c5545?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1624694406248-2621a644f807?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
            }
        ];

        // --- Indian Transport Routes ---
        const transports = [
            {
                type: 'flight',
                company: 'IndiGo',
                from: 'New Delhi',
                to: 'Dehradun',
                departureTime: new Date(Date.now() + 86400000),
                arrivalTime: new Date(Date.now() + 89000000),
                price: 3500,
                seatsAvailable: 45,
                photos: [],
            },
            {
                type: 'flight',
                company: 'Vistara',
                from: 'Mumbai',
                to: 'Dehradun',
                departureTime: new Date(Date.now() + 172800000),
                arrivalTime: new Date(Date.now() + 180000000),
                price: 5500,
                seatsAvailable: 30,
                photos: [],
            },
            {
                type: 'flight',
                company: 'Air India',
                from: 'Chennai',
                to: 'Tirupati',
                departureTime: new Date(Date.now() + 90000000),
                arrivalTime: new Date(Date.now() + 92000000),
                price: 2500,
                seatsAvailable: 60,
                photos: [],
            },
            {
                type: 'train',
                company: 'Indian Railways',
                from: 'New Delhi',
                to: 'Haridwar',
                departureTime: new Date(Date.now() + 100000000),
                arrivalTime: new Date(Date.now() + 115000000),
                price: 450,
                seatsAvailable: 200,
                photos: [],
            },
            {
                type: 'train',
                company: 'Vande Bharat Express',
                from: 'New Delhi',
                to: 'Varanasi',
                departureTime: new Date(Date.now() + 110000000),
                arrivalTime: new Date(Date.now() + 130000000),
                price: 1800,
                seatsAvailable: 150,
                photos: [],
            },
            {
                type: 'bus',
                company: 'UTC Volvo',
                from: 'Haridwar',
                to: 'Rishikesh',
                departureTime: new Date(Date.now() + 120000000),
                arrivalTime: new Date(Date.now() + 123000000),
                price: 100,
                seatsAvailable: 40,
                photos: [],
            },
            {
                type: 'bus',
                company: 'RedBus Premium',
                from: 'Mumbai',
                to: 'Shirdi',
                departureTime: new Date(Date.now() + 140000000),
                arrivalTime: new Date(Date.now() + 160000000),
                price: 800,
                seatsAvailable: 35,
                photos: [],
            },
            {
                type: 'car',
                company: 'Ola Outstation',
                from: 'Dehradun',
                to: 'Kedarnath Base',
                departureTime: new Date(Date.now() + 50000000),
                arrivalTime: new Date(Date.now() + 70000000),
                price: 4000,
                seatsAvailable: 3,
                photos: [],
            }
        ];

        await Destination.insertMany(destinations);
        await Transport.insertMany(transports);

        console.log('Database re-seeded with MORE Indian Temples!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedIndiaContent();
