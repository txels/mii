#!/usr/bin/env node
// npm install amqplib
var amqp = require('amqplib/callback_api');

var
  MODEL = "6-diesel_generator_schema",
  INSTANCE_NAME = "test_dg",
  //HOST = "api.miimetiq.local",
  HOST = 'localhost:6772',
  USERNAME = MODEL + "/" + INSTANCE_NAME,
  PASSWORD = "anypass",
  DEVICE_ID = "56090580e7e466125aa1c0a5",
  INSTRUMENT = "generator",
  WRITER = "power",
  TYPE = "boolean",
  //CONNECTION_STRING = `amqp://"${USERNAME}":${PASSWORD}@${HOST}`,
  CONNECTION_STRING = `amqp://${HOST}`,
  BINDING_KEY = `miimetiq.ds.writer.${TYPE}.${MODEL}.${DEVICE_ID}.${INSTRUMENT}.${WRITER}`;


console.log(CONNECTION_STRING, BINDING_KEY);

var queueName;


var callback = function(ch, msg) {
  let body = msg.content,
      routingKey = msg.fields.routingKey,
      exchange = msg.fields.exchange,
      taskId = msg.properties.correlationId,
      replyId = taskId.replace(/\-/g, '');

  console.log(` [x] ${routingKey}:${body}`);

  let answerMsg = JSON.stringify({
    status: 'SUCCESS',
    result: {status: 'OK'},
    task_id: taskId
  });

  // console.log('Answer:', answerMsg);
  // console.log('Reply queue:', replyId);

  ch.assertQueue(
    replyId,
    {autoDelete: true, durable: true, arguments: {"x-expires": 60 * 1000}}
  );
  ch.bindQueue(replyId, 'celeryresults', replyId);
  ch.publish('celeryresults', replyId, new Buffer(answerMsg), {contentType: 'application/json'});
};


amqp.connect(CONNECTION_STRING, function(err, conn) {
  // console.log(err);
  conn.createChannel((err, ch) => {
    ch.assertQueue('', null, (err, q) => {
      let callbackWrapper = (msg) => {
        // console.log(msg);
        return callback(ch, msg);
      };

      let queueName = q.queue;
      ch.bindQueue(queueName, 'miimetiq', BINDING_KEY);
      console.log(" [*] Waiting for messages. To exit press CTRL+C");
      ch.consume(queueName, callbackWrapper, {noAck: true});
    });
  });
});
