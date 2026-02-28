const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/adminMiddleware');

router.route('/')
    .get(protect, getFavorites)
    .post(protect, toggleFavorite);

module.exports = router;
