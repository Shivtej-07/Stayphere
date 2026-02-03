
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env');
console.log(`Loading .env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
}

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        // console.log(`URI: ${uri.substring(0, 15)}...`); 

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};

const makeAdmin = async () => {
    await connectDB();

    try {
        const email = 'admintest@example.com';
        console.log(`Looking for user: ${email}`);
        const user = await User.findOne({ email });

        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`User ${user.username} is now an Admin`);
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error(`Error updating user: ${err.message}`);
    }

    // Close connection
    await mongoose.connection.close();
    process.exit(0);
};

makeAdmin();
