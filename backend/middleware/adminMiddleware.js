const jwt = require('jsonwebtoken');
const User = require('../models/User');

// adminMiddleware.js protect logic
const protect = async (req, res, next) => {
    console.log("Protect middleware started");
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            console.log("Token decoded:", decoded.id);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log("Protect: user not found");
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            console.log("Protect: user found, calling next...");
            return next();
        } catch (error) {
            console.error("Protect middleware error:", error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log("Protect: no token provided");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
