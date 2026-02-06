const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
const seedAdmin = async () => {
    try {
        await connectDB();
        await User.deleteMany({ email: 'admin@example.com' });

        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
            avatar: '' // Ensure no broken default URL
        });

        console.log('Admin user created:', adminUser);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
