const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const {
            hotelName,
            location,
            image,
            checkIn,
            checkOut,
            guests,
            travelingFrom,
            transportType,
            price,
            paymentId,
            seats,
            transportId
        } = req.body;

        const booking = await Booking.create({
            user: req.user.id, // From auth middleware
            hotelName,
            location,
            image,
            checkIn,
            checkOut,
            guests,
            travelingFrom,
            transportType,
            price,
            paymentId,
            seats,
            transportId
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        // Find matching hotel coordinates for stay bookings
        const bookingsWithCoords = await Promise.all(bookings.map(async (booking) => {
            const b = booking.toObject();
            if (!booking.transportId || booking.transportId === 'undefined') {
                // Look up matching hotel to get coordinates
                const hotel = await Hotel.findOne({ name: booking.hotelName });
                if (hotel && hotel.location && hotel.location.coordinates) {
                    b.coordinates = hotel.location.coordinates; // [lng, lat]
                }
            }
            return b;
        }));

        res.json(bookingsWithCoords);
    } catch (error) {
        console.error('Get My Bookings Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'username email').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await booking.deleteOne();
        res.json({ message: 'Booking removed' });
    } catch (error) {
        console.error('Delete Booking Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Make sure user owns the booking or is admin
        if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ error: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        // Process refund if paymentId exists and is a Stripe payment intent ID
        if (booking.paymentId && booking.paymentId.startsWith('pi_')) {
            try {
                await stripe.refunds.create({
                    payment_intent: booking.paymentId,
                });
            } catch (stripeError) {
                console.error('Stripe Refund Error:', stripeError);
                return res.status(400).json({ error: `Stripe refund failed: ${stripeError.message}` });
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ success: true, message: 'Booking cancelled and refunded successfully', booking });
    } catch (error) {
        console.error('Cancel Booking Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Get booked seats for a specific transport or criteria
// @route   GET /api/bookings/booked-seats
// @access  Public
exports.getBookedSeats = async (req, res) => {
    try {
        const { transportId, transportType, travelingFrom, location, checkIn } = req.query;

        let query = { status: { $ne: 'cancelled' } };

        if (transportId && transportId !== 'undefined' && transportId !== '') {
            query.transportId = transportId;
        } else if (transportType && transportType !== 'None') {
            query.transportType = transportType;
            if (travelingFrom) query.travelingFrom = travelingFrom;
            if (location) query.location = location;
            
            if (checkIn) {
                const startDate = new Date(checkIn);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(checkIn);
                endDate.setHours(23, 59, 59, 999);
                query.checkIn = { $gte: startDate, $lte: endDate };
            }
        } else {
            return res.json([]);
        }

        const bookings = await Booking.find(query, 'seats');
        const bookedSeats = bookings.reduce((acc, booking) => {
            return acc.concat(booking.seats || []);
        }, []);

        res.json([...new Set(bookedSeats)]);
    } catch (error) {
        console.error('Get Booked Seats Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};
