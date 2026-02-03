const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['flight', 'train', 'bus', 'car'],
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        departureTime: {
            type: Date,
            required: true,
        },
        arrivalTime: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        seatsAvailable: {
            type: Number,
            default: 0,
        },
        photos: {
            type: [String],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transport', TransportSchema);
