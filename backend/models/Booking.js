const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Relaxing strict linking to 'Hotel'/'Room' models for now to support simulated frontend data
        hotelName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
            default: 1
        },
        travelingFrom: {
            type: String,
            default: 'Not specified',
        },
        transportType: {
            type: String,
            default: 'None',
        },
        seats: {
            type: [String],
            default: [],
        },
        price: {
            type: Number, // Total price paid
            required: true,
        },
        status: {
            type: String,
            enum: ['booked', 'cancelled', 'completed'],
            default: 'booked',
        },
        paymentId: {
            type: String, // Stripe PaymentIntent ID or UPI transaction ref
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
