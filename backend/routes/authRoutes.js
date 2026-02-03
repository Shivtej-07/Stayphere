const express = require('express');
const { register, login, getAllUsers, deleteUser } = require('../controllers/authController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
