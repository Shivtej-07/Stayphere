const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    rooms: {
        type: [String], // Keeping as String for now to match current usage if just IDs are stored, or update to ObjectId if intended.
        // Actually, let's make it robust. References are usually ObjectId.
        // If the user intends just strings, that's fine, but better practice is ObjectId.
        // However, looking at Room.js, it has roomNumbers. 
        // Let's stick to the plan: "Review and update Hotel.js relationships".
        // Changing to ObjectId ref makes 'populate' work.
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Room',
    },
    cheapestPrice: {
        type: Number,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    facilities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Facility',
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false,
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere', // 2dsphere index for proximity queries
        },
    },
});

module.exports = mongoose.model('Hotel', HotelSchema);
