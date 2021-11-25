const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const User = mongoose.model('User');

const router = express.Router();

router.use(requireAuth);

router.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { username, email, likedMovies, unlikedMovies } = user;
        const userInfo = { username, email, likedMovies, unlikedMovies };
        res.send(userInfo);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/user/movie/like', async (req, res) => {
    const { id } = req.body;

    if (id === undefined) {
        return res.status(402).send({ error: 'Please provide de ID of the movie to be liked' });
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { likedMovies: id } }, { new: true });
        const { username, email, likedMovies, unlikedMovies } = user;
        const userInfo = { username, email, likedMovies, unlikedMovies };
        res.send(userInfo);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.delete('/user/movie/like', async (req, res) => {
    const { id } = req.body;

    if (id === undefined) {
        return res.status(402).send({ error: 'Please provide de ID of the movie to removed from liked' });
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { likedMovies: id } }, { new: true });
        const { username, email, likedMovies, unlikedMovies } = user;
        const userInfo = { username, email, likedMovies, unlikedMovies };
        res.send(userInfo);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/user/movie/unlike', async (req, res) => {
    const { id } = req.body;

    if (id === undefined) {
        return res.status(402).send({ error: 'Please provide de ID of the movie to be unliked' });
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $addToSet: { unlikedMovies: id } }, { new: true });
        const { username, email, likedMovies, unlikedMovies } = user;
        const userInfo = { username, email, likedMovies, unlikedMovies };
        res.send(userInfo);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.delete('/user/movie/unlike', async (req, res) => {
    const { id } = req.body;

    if (id === undefined) {
        return res.status(402).send({ error: 'Please provide de ID of the movie to removed from unliked' });
    }

    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $pull: { unlikedMovies: id } }, { new: true });
        const { username, email, likedMovies, unlikedMovies } = user;
        const userInfo = { username, email, likedMovies, unlikedMovies };
        res.send(userInfo);
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

module.exports = router;