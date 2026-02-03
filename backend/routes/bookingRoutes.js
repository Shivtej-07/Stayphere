const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, deleteBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/', protect, admin, getAllBookings);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
