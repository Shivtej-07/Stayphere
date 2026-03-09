const express = require('express');
const router = express.Router();
const { incrementVisitorCount, getVisitorCount } = require('../controllers/statController');

router.get('/', getVisitorCount);
router.post('/visit', incrementVisitorCount);

module.exports = router;
