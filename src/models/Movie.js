const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    release_date: {
        type: Date,
        required: true
    },
    vote_average: {
        type: Number,
        required: true
    },
    poster_path: {
        type: String,
        required: true
    }
});

mongoose.model('Movie', movieSchema);