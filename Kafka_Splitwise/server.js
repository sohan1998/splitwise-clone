var connection = new require('./kafka/Connection');
var getGroups = require('./services/Getgroups.js');
var AddBill = require('./services/AddBill.js');
var AddComment = require('./services/AddComment.js');

function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + ' ', fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        console.log('data in server.js');

        fname.handle_request(data.data, function (err, res) {
            console.log('after handle' + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res,
                    }),
                    partition: 0,
                },
            ];
            producer.send(payloads, function (err, data) {
                console.log('producer.send', data);
            });
            return;
        });
    });
}

handleTopicRequest('getGroups', getGroups);
handleTopicRequest('AddComment', AddComment);
handleTopicRequest('AddBill', AddBill);
