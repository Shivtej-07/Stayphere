
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(u => {
            console.log(`User: ${u.username}, Email: ${u.email}, ID: ${u._id}, IsAdmin: ${u.isAdmin}`);
        });

        if (users.length === 0) {
            console.log('No users found! Registration might be failing silently or cleaning up improperly.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
