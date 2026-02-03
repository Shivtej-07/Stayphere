const Booking = require('../models/Booking');

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
            price,
            paymentId
        } = req.body;

        const booking = await Booking.create({
            user: req.user.id, // From auth middleware
            hotelName,
            location,
            image,
            checkIn,
            checkOut,
            guests,
            price,
            paymentId
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
        res.json(bookings);
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
