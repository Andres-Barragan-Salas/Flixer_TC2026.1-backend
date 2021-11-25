const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Movie = mongoose.model('Movie');

const router = express.Router();

router.use(requireAuth);

router.get('/movies', async (req, res) => {
    try {
        const { id } = req.body;

        let filter;
        if (id === undefined) filter = {};
        else filter = { _id: id };

        const movies = await Movie.find(filter);
        res.send(movies);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/movies/:filter', async (req, res) => {
    try {
        const { filter } = req.params;
        const { value } = req.query;
        const possibleFilters = ['title', 'genre', 'overview', 'release_date', 'vote_average'];

        if (!possibleFilters.includes(filter)) {
            return res.status(402).send({ error: 'You must provide a valid movie filter' });
        }

        if (!value) {
            return res.status(402).send({ error: 'You must provide a value to filter movies with' });
        }

        const movies = await Movie.find({ [filter]: { $regex: value } }).sort(filter);
        res.send(movies);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;