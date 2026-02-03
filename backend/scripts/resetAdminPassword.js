const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

const resetPassword = async () => {
    // Load env
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'admintest@example.com';
        const newPassword = 'password123';

        const user = await User.findOne({ email });
        if (user) {
            console.log(`Found User: ${user.email}`);

            // Explicitly set password to trigger modified check
            user.password = newPassword;
            await user.save();

            console.log(`Password reset to '${newPassword}' successfully.`);
            console.log('You can now login with these credentials.');
        } else {
            console.log(`User ${email} not found. Creating one...`);
            await User.create({
                username: 'Admin Test',
                email: email,
                password: newPassword,
                isAdmin: true
            });
            console.log(`Created new admin user with password '${newPassword}'`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

resetPassword();
