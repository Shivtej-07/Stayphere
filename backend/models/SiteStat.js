const mongoose = require('mongoose');

const siteStatSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
        default: 'global_stats'
    },
    visitorCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SiteStat', siteStatSchema);
