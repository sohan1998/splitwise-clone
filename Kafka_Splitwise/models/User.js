const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    profileImg: {
        type: String,
        default: 'https://splitwisebucket1.s3.us-east-2.amazonaws.com/depositphotos_52374307-stock-illustration-blue-profile-icon.jpg',
    },
    groups_added: {
        type: Array,
        default: [],
    },
    groups_invited: {
        type: Array,
        default: [],
    },
});

module.exports = User = mongoose.model('users', UserSchema);
