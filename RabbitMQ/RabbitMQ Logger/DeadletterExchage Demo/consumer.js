var amqp = require("amqplib/callback_api");
var crontab = require('node-crontab');

amqp.connect("amqp://localhost:5672", function (err, conn) {
conn.createChannel(function (err, ch) {
    var ex = 'direct_logs';
    var ex2 = 'dead-letter-test';
    var severity = 'enterprise-1-key';

    //assert "direct" exchange
    ch.assertExchange(ex, 'direct', { durable: true });
    //assert "dead-letter-test" exchange
    ch.assertExchange(ex2, 'direct', { durable: true });

    //if acknowledgement is nack() then message will be stored in second exchange i.e. ex2="dead-letter-test"
    ch.assertQueue('enterprise-11', { exclusive: false, deadLetterExchange: ex2 }, function (err, q) {
        var n = 0;
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
        console.log(q);

        //Binding queue with "direct_logs" exchange
        ch.bindQueue(q.queue, ex, severity);
        //Binding the same queue with "dead-letter-test"
        ch.bindQueue(q.queue, ex2, severity);

        ch.consume(q.queue, function (msg) {
            // consume messages via "dead-letter-exchange" exchange at every second.
            if (msg.fields.exchange === ex2) {
                crontab.scheduleJob("* * * * * *", function () {
                    console.log("Received by latest exchange %s", msg.fields.routingKey, msg.content.toString());
                });
            } else {
                console.log("Received %s", msg.fields.routingKey, msg.content.toString());
            }

            if (msg.content.toString() === 'malware') {
                // this will executes first time only. Here I'm sending nack() so message will be stored in "deadLetterExchange"
                ch.ack(msg, false, false);
                
            } else {
                ch.ack(msg)
            }
        }, { noAck: false });
    });
  });
});