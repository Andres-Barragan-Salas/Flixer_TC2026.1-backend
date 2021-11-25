const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    usernames: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        default: '',
        required: true
    }
});

mongoose.model('List', listSchema);