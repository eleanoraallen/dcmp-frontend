const mongoose = require('mongoose');

const Point = new mongoose.Schema({
    mapId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    otherText: {
        type: String,
    },
    creatorName: {
        type: String,
    },
});

module.exports = mongoose.model('Point', Point);