const express = require('express');
const { createHotel, getHotels, getHotelsByDistance, updateHotel, deleteHotel } = require('../controllers/hotelController');

const router = express.Router();

const { protect, admin } = require('../middleware/adminMiddleware');

router.route('/').get(getHotels).post(protect, admin, createHotel);
router.route('/:id')
    .put(protect, admin, updateHotel)
    .delete(protect, admin, deleteHotel);
router.route('/nearby').get(getHotelsByDistance);

module.exports = router;
