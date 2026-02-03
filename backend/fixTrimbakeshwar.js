const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const dotenv = require('dotenv');

dotenv.config();

const fixTrimbakeshwar = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find by name pattern (regex insensitive)
        const dest = await Destination.findOne({ name: { $regex: /Trimbakeshwar/i } });

        if (!dest) {
            console.log('Destination not found!');
            process.exit(1);
        }

        console.log(`Found Destination: ${dest.name}`);
        console.log(`Old Photos: ${dest.photos[0].substring(0, 30)}...`);

        // Update with a valid image URL (using a generic temple/India spiritual image from Unsplash as placeholder)
        const newPhoto = "https://images.unsplash.com/photo-1605626245053-29472ee9180c?auto=format&fit=crop&w=800&q=80"; // Trimbakeshwar Jyotirlinga or similar temple image

        dest.photos = [newPhoto];
        await dest.save();

        console.log('Successfully updated photo!');
        console.log(`New Photo: ${dest.photos[0]}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixTrimbakeshwar();
