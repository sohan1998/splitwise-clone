const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const Group = require('../models/Group');
const Bill = require('../models/Bills');
const Transaction = require('../models/Transaction');

router.post('/amountowed/', async (req, res) => {
    try {
        console.log('Inside Amount I am owed');
        var useremail = req.body.useremail;
        let owed = await Transaction.aggregate([
            { $match: { sender: useremail } },
            { $group: { _id: '$receiver', splitamount: { $sum: '$splitamount' } } },
        ]);

        res.status(200).json({ amountowed: owed });
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
});

router.post('/amountowe/', async (req, res) => {
    try {
        console.log('Inside Amount I owe');
        var useremail = req.body.useremail;
        let owe = await Transaction.aggregate([
            { $match: { receiver: useremail } },
            { $group: { _id: '$sender', splitamount: { $sum: '$splitamount' } } },
        ]);
        res.status(200).json({ amountowe: owe });
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
});
