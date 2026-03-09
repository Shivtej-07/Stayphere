const SiteStat = require('../models/SiteStat');

// @desc    Increment visitor count
// @route   POST /api/stats/visit
// @access  Public
exports.incrementVisitorCount = async (req, res) => {
    try {
        let stat = await SiteStat.findOne({ identifier: 'global_stats' });

        if (!stat) {
            stat = await SiteStat.create({ identifier: 'global_stats', visitorCount: 1 });
        } else {
            stat.visitorCount += 1;
            await stat.save();
        }

        res.status(200).json({ success: true, count: stat.visitorCount });
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get visitor count
// @route   GET /api/stats
// @access  Public
exports.getVisitorCount = async (req, res) => {
    try {
        let stat = await SiteStat.findOne({ identifier: 'global_stats' });

        if (!stat) {
            stat = await SiteStat.create({ identifier: 'global_stats', visitorCount: 0 });
        }

        res.status(200).json({ success: true, count: stat.visitorCount });
    } catch (error) {
        console.error('Error getting visitor count:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
