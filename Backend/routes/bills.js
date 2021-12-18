const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const Group = require('../models/Group');
const Bill = require('../models/Bills');
const Transaction = require('../models/Transaction');
var mongoose = require('mongoose');
const kafka = require('../kafka/client');

router.post('/addbill/', async (req, res) => {
  kafka.make_request('AddBill', req.body, function (err, result) {
    console.log('in result');
    // console.log("results in my getgroups ", res);
    if (err) {
      console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'Could not fetch groups, Try Again.',
      });
    } else {
      // console.log(res);
      res.status(200).json(result);
    }
  });
});

router.post('/getallbills/', async (req, res) => {
  try {
    console.log('Inside Get  All Bills');
    var groupname = req.body.groupname;
    const allbillsinfo = await Bill.find(
      { groupname: groupname },
      { billamount: 1, billdescription: 1, _id: 1, billcomments: 1 }
    );
    res.status(200).json({ allbillsinfo: allbillsinfo });
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
  }
});

router.post('/addcomment/', async (req, res) => {
  kafka.make_request('AddComment', req.body, function (err, result) {
    console.log('in result');
    // console.log("results in my getgroups ", res
    // );
    if (err) {
      console.log('Inside err');
      res.json({
        status: 'error',
        msg: 'Could not fetch groups, Try Again.',
      });
    } else {
      // console.log(res)
      res.status(200).json(result);
    }
  });
});

router.post('/deletecomment/', async (req, res) => {
  try {
    console.log('Inside delete comments');
    var cid = req.body.cid;
    var bid = req.body.bid;

    console.log('Here1');
    await Bill.updateOne(
      { _id: mongoose.Types.ObjectId(bid) },
      {
        $pull: { billcomments: { comment_id: mongoose.Types.ObjectId(cid) } },
      }
    );
    // console.log("Got item",item)
    res.status(200).json({ message: 'COmment Deleted!' });
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
  }
});

module.exports = router;
