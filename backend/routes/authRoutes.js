const express = require('express');
const { register, login, googleLogin, getAllUsers, deleteUser, getMe, updateProfile } = require('../controllers/authController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
