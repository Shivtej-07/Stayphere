const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Destination', 'Hotel', 'Transport']
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can only favorite a specific item once
favoriteSchema.index({ user: 1, item: 1, onModel: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
