const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({
    groupname: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    grouppic: {
        type: String,
    },
    bills: {
        type: Array,
        default: [],
    },
    groupmembers: {
        type: Array,
        default: [],
    },
    groupmembersacceptinvite: {
        type: Array,
        default: [],
    },
});

module.exports = Group = mongoose.model('groups', GroupSchema);
