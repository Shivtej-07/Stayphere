const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        icon: {
            type: String, // Can be a URL or an icon class name
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Facility', FacilitySchema);
