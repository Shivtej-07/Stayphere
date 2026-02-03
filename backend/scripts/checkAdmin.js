const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

const checkAdmin = async () => {
    // Load env
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'admintest@example.com' });
        if (user) {
            console.log(`User: ${user.email}`);
            console.log(`Is Admin: ${user.isAdmin}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log('User admintest@example.com not found');
        }

        // List all admins
        const admins = await User.find({ isAdmin: true });
        console.log(`Total Admins: ${admins.length}`);
        admins.forEach(a => console.log(`- ${a.email} (${a._id})`));

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

checkAdmin();
