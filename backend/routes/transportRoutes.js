const express = require('express');
const router = express.Router();
const { getTransports, createTransport, updateTransport, deleteTransport } = require('../controllers/transportController');
const { protect, admin } = require('../middleware/adminMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getTransports);
router.post('/', protect, admin, upload.array('photos', 10), createTransport);
router.route('/:id')
    .put(protect, admin, upload.array('photos', 10), updateTransport)
    .delete(protect, admin, deleteTransport);

module.exports = router;
