const Destination = require('../models/Destination');

const getDestinations = async (req, res) => {
    try {
        let query = Destination.find({});

        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);

        if (!isNaN(page) && !isNaN(limit)) {
            const total = await Destination.countDocuments();
            const startIndex = (page - 1) * limit;
            query = query.skip(startIndex).limit(limit);
            const destinations = await query;
            const pages = Math.ceil(total / limit);

            res.json({
                success: true,
                count: destinations.length,
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                },
                data: destinations
            });
        } else {
            const destinations = await query;
            res.json(destinations);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const destination = new Destination(req.body);
        const createdDestination = await destination.save();
        res.status(201).json(createdDestination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        await destination.deleteOne();
        res.json({ message: 'Destination removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDestinations,
    createDestination,
    updateDestination,
    deleteDestination,
    getDestinationById
};
