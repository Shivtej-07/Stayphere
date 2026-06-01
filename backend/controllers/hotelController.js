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

exports.getHotels = async (req, res, next) => {
    try {
        let query = Hotel.find();

        // Pagination
        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);
        
        let hotels;
        let total = await Hotel.countDocuments();

        if (!isNaN(page) && !isNaN(limit)) {
            const startIndex = (page - 1) * limit;
            query = query.skip(startIndex).limit(limit);
            hotels = await query;
            const pages = Math.ceil(total / limit);
            
            res.status(200).json({
                success: true,
                count: hotels.length,
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                },
                data: hotels,
            });
        } else {
            hotels = await query;
            res.status(200).json({
                success: true,
                count: hotels.length,
                data: hotels,
            });
        }
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

// @desc    Get single hotel details
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate('rooms')
            .populate('facilities');

        if (!hotel) {
            return res.status(404).json({ success: false, error: 'Hotel not found' });
        }

        res.status(200).json({
            success: true,
            data: hotel,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
