var mongo = require('./mongoose');
const Bill = require('../models/Bills');
const Transaction = require('../models/Transaction');
var mongoose = require('mongoose');

async function handle_request(msg, callback) {
    try {
        console.log('Inside add comments');
        var bill_id = msg.bill_id;
        var commentcreatedby = msg.useremail;
        var commentmessage = msg.comment;

        console.log('Here');
        const id = mongoose.Types.ObjectId();
        console.log('Here1');
        await Bill.updateOne(
            { _id: bill_id },
            {
                $push: {
                    billcomments: {
                        comment_id: id,
                        comment_createdby: commentcreatedby,
                        comment_message: commentmessage,
                    },
                },
            }
        );

        callback(null, { message: 'Comment added successfully!' });
    } catch (error) {
        console.log(error);
        callback(null, error);
    }
}

exports.handle_request = handle_request;
