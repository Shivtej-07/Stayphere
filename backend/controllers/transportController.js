const Transport = require('../models/Transport');

const getTransports = async (req, res) => {
    try {
        const { from, to, type, date, page, limit } = req.query;
        console.log('getTransports query params:', req.query);
        let query = {};

        if (from) query.from = { $regex: from, $options: 'i' };
        if (to) query.to = { $regex: to, $options: 'i' };
        if (type) query.type = type;
        if (date) {
            // Simple date matching (start of day to end of day)
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.departureTime = { $gte: startDate, $lt: endDate };
        }

        let findQuery = Transport.find(query).sort({ departureTime: 1 });
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        if (!isNaN(pageNum) && !isNaN(limitNum)) {
            const total = await Transport.countDocuments(query);
            const startIndex = (pageNum - 1) * limitNum;
            findQuery = findQuery.skip(startIndex).limit(limitNum);
            const transports = await findQuery;
            const pages = Math.ceil(total / limitNum);

            res.status(200).json({
                success: true,
                count: transports.length,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages
                },
                data: transports
            });
        } else {
            const transports = await findQuery;
            res.status(200).json(transports);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new transport option
// @route   POST /api/transports
// @access  Private (Admin only - for now public for easy seeding)
const createTransport = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const transport = await Transport.create(req.body);
        res.status(201).json(transport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update transport
// @route   PUT /api/transports/:id
// @access  Admin
const updateTransport = async (req, res) => {
    try {
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => file.path);
        } else if (req.body.photos && typeof req.body.photos === 'string') {
            req.body.photos = req.body.photos.split(',').map(p => p.trim()).filter(p => p !== '');
        }

        const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        res.status(200).json(transport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete transport
// @route   DELETE /api/transports/:id
// @access  Admin
const deleteTransport = async (req, res) => {
    try {
        const transport = await Transport.findById(req.params.id);
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        await transport.deleteOne();
        res.status(200).json({ message: 'Transport removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransports,
    createTransport,
    updateTransport,
    deleteTransport
};
