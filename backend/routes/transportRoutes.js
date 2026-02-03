const express = require('express');
const router = express.Router();
const { getTransports, createTransport, updateTransport, deleteTransport } = require('../controllers/transportController');

const { protect, admin } = require('../middleware/adminMiddleware');

router.get('/', getTransports);
router.post('/', protect, admin, createTransport);
router.route('/:id')
    .put(protect, admin, updateTransport)
    .delete(protect, admin, deleteTransport);

module.exports = router;
