var mongo = require('./mongoose');
const User = require('../models/User');

async function handle_request(msg, callback) {
    try {
        var useremail = msg.useremail;
        console.log('emialll', useremail);
        console.log('Hello World');
        const allgroups = await User.find({ email: useremail }, { groups_invited: 1 });
        console.log(allgroups);
        console.log('Hello world2');

        callback(null, allgroups);
    } catch (error) {
        console.log(error);
        callback(null, error);
    }
}

exports.handle_request = handle_request;
