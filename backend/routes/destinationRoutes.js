const express = require('express');
const router = express.Router();
const {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination,
    getDestinationById
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/').get(getDestinations).post(protect, admin, upload.array('photos', 10), createDestination);
router.route('/:id')
    .get(getDestinationById)
    .put(protect, admin, upload.array('photos', 10), updateDestination)
    .delete(protect, admin, deleteDestination);

module.exports = router;
