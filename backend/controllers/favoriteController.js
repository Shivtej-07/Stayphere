const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .populate('item')
            .sort({ createdAt: -1 });

        res.status(200).json(favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching favorites' });
    }
};

// @desc    Toggle favorite (Add or Remove)
// @route   POST /api/favorites
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const { itemId, onModel } = req.body;

        if (!itemId || !onModel) {
            return res.status(400).json({ message: 'Please provide itemId and onModel' });
        }

        if (!['Destination', 'Hotel', 'Transport'].includes(onModel)) {
            return res.status(400).json({ message: 'Invalid model type for favorite' });
        }

        // Check if favorite already exists
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            item: itemId,
            onModel: onModel
        });

        if (existingFavorite) {
            // Un-favorite (Remove)
            await Favorite.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({ message: 'Removed from favorites', action: 'removed', itemId });
        } else {
            // Favorite (Add)
            const favorite = await Favorite.create({
                user: req.user.id,
                item: itemId,
                onModel: onModel
            });
            res.status(201).json({ message: 'Added to favorites', action: 'added', favorite });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error toggling favorite' });
    }
};

module.exports = {
    getFavorites,
    toggleFavorite
};
