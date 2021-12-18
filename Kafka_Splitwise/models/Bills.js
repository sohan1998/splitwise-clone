const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const BillSchema = new Schema({
    billamount: {
        type: Number,
        required: true,
    },
    billdate: {
        type: Date,
        default: Date.now,
    },
    billcreatedby: {
        type: String,
    },
    billdescription: {
        type: String,
    },
    groupname: {
        type: String,
    },
    billcomments: {
        type: Array,
        default: [],
    },
});

module.exports = User = mongoose.model('bills', BillSchema);
