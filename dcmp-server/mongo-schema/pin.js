const mongoose = require('mongoose');

const Pin = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    mapId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    coordinates: {
        type: [{ type: Number }],
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

module.exports = mongoose.model('Pin', Pin);