const express = require('express');
const router = express.Router();
const {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/adminMiddleware');

router.route('/').get(getDestinations).post(protect, admin, createDestination);
router.route('/:id')
    .put(protect, admin, updateDestination)
    .delete(protect, admin, deleteDestination);

module.exports = router;
