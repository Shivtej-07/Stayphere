const Hotel = require('../models/Hotel');

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Admin
exports.createHotel = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const hotel = await Hotel.create(req.body);
        res.status(201).json({
            success: true,
            data: hotel,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get hotels within a radius (Map API)
// @route   GET /api/hotels/nearby?lat=x&lng=y&dist=z
// @access  Public
exports.getHotelsByDistance = async (req, res, next) => {
    const { lat, lng, dist } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ success: false, error: 'Please provide lat and lng' });
    }

    const radius = dist || 10000; // Default 10km if not provided

    try {
        const hotels = await Hotel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: parseFloat(radius),
                },
            },
        });

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Admin
exports.updateHotel = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Admin
exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        await hotel.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
