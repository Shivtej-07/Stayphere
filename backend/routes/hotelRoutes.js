const express = require('express');
const { createHotel, getHotels, getHotelsByDistance, updateHotel, deleteHotel } = require('../controllers/hotelController');
const { upload } = require('../config/cloudinary');

const router = express.Router();

const { protect, admin } = require('../middleware/adminMiddleware');

router.route('/').get(getHotels).post(protect, admin, upload.array('photos', 10), createHotel);
router.route('/:id')
    .put(protect, admin, upload.array('photos', 10), updateHotel)
    .delete(protect, admin, deleteHotel);
router.route('/nearby').get(getHotelsByDistance);

module.exports = router;
