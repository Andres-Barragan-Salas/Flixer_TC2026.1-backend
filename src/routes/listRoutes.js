const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const User = mongoose.model('User');
const List = mongoose.model('List');
const Movie = mongoose.model('Movie');

const router = express.Router();

router.use(requireAuth);

router.get('/lists', async (req, res) => {
    try {
        const lists = await List.find({ users: req.user._id });
        res.send(lists);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.get('/movieList/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const list = await List.findOne({ _id: id });

        const aggregation = [
            { '$match': { '_id': { '$in': list.users } } }, 
            { '$group': { '_id': 0, 'sets': { '$push': '$likedMovies' }, 'initialSet': {'$first': '$likedMovies' } } },
            { '$project': { 'ids': { '$reduce': { 'input': '$sets', 'initialValue': '$initialSet', 'in': { '$setIntersection': [ '$$value', '$$this' ] } } } } }
        ]

        const aggregationResult = await User.aggregate(aggregation);
        const moviesIds = aggregationResult[0].ids;

        if (moviesIds.length === 0) {
            res.send([]);
            return;
        }

        const movies = await Movie.find({ _id: { $in: moviesIds } });
        res.send(movies);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.post('/lists', async (req, res) => {
    const { name, partnerEmail } = req.body;
    const { user } = req;

    if (!name || !partnerEmail) {
        return res.status(402).send({ error: 'You must provide a name for the list and a companion email' });
    }

    if (partnerEmail === user.email) {
        return res.status(402).send({ error: 'Please provide a companion email other that yours' });
    }

    try {
        const partnerUser = await User.findOne({ email: partnerEmail });
        if (!partnerUser) {
            return res.status(402).send({ error: 'No user with email ' + partnerEmail + ' exists' });
        }

        const list = new List({ name, users: [user._id, partnerUser._id], usernames: [user.username, partnerUser.username] });
        await list.save();
        const lists = await List.find({ users: user._id });
        res.send(lists);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.put('/lists', async (req, res) => {
    const { id, partnerEmail } = req.body;
    const { user } = req;

    if (!id || !partnerEmail) {
        return res.status(402).send({ error: 'You must provide a list ID and a companion email' });
    }

    if (partnerEmail === user.email) {
        return res.status(402).send({ error: 'Please provide a companion email other that yours' });
    }

    try {
        const partnerUser = await User.findOne({ email: partnerEmail });
        if (!partnerUser) {
            return res.status(402).send({ error: 'No user with email ' + partnerEmail + ' exists' });
        }

        await List.updateOne({ _id: id }, { $addToSet: { users: partnerUser._id, usernames: partnerUser.username } });
        const lists = await List.find({ users: user._id });
        res.send(lists);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

router.delete('/lists', async (req, res) => {
    const { id } = req.body;
    const { user } = req;

    if (!id) {
        return res.status(402).send({ error: 'Please provide de ID of the list to delete' });
    }

    try {
        await List.deleteOne({ _id: id });
        const lists = await List.find({ users: user._id });
        res.send(lists);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;