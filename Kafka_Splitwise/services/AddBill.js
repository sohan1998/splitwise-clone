var mongo = require('./mongoose');
const Bill = require('../models/Bills');
const Transaction = require('../models/Transaction');

async function handle_request(msg, callback) {
    try {
        var useremail = msg.useremail;
        var groupname = msg.groupname;
        var billdescription = msg.billdescription;
        var billamount = msg.billamount;
        var numberofmembers = msg.numberofmembers;
        var memberemails = msg.memberemails;

        const bill = new Bill();
        bill.billcreatedby = useremail;
        bill.groupname = groupname;
        bill.billdescription = billdescription;
        bill.billamount = billamount;
        await bill.save();

        var splitamount = billamount / numberofmembers;
        splitamount = splitamount.toFixed(2);
        console.log(splitamount);
        let sender = useremail;
        let receiverarray = [];

        for (let i = 0; i < memberemails.length; i++) {
            if (memberemails[i] != useremail) {
                receiverarray.push(memberemails[i]);
            }
        }
        console.log(receiverarray);
        for (let i = 0; i < receiverarray.length; i++) {
            let transaction = new Transaction();

            transaction.receiver = receiverarray[i];

            transaction.sender = useremail;
            transaction.splitamount = splitamount;

            let trans = await transaction.save();

            if (trans) console.log(trans);
        }

        callback(null, { message: 'Bill added successfully!' });
    } catch (error) {
        console.log(error);
        callback(null, error);
    }
}

exports.handle_request = handle_request;
