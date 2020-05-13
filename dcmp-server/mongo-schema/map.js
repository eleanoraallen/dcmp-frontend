const mongoose = require('mongoose');

const Map = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    mapName: {
        type: String,
    },
    description: {
        type: String,
    },
    creatorName: {
        type: String,
    },
});

module.exports = mongoose.model('Map', Map);