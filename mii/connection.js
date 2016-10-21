var amqp = require('amqplib/callback_api');

const EXCHANGE = 'miimetiq';

class Broker {
  constructor(host, port, exchange, username, password) {
    let credentials = '';
    if (username) {
      credentials = `"${username}:${password}"@`;
    }
    this.connectionString = `amqp://${credentials}${host}:${port}`;
    this.exchange = exchange || EXCHANGE;
  }

  connect(callback) {
    // console.log(this.connectionString);
    return amqp.connect(this.connectionString, callback);
  }

  getBindingKey(signal) {
    return `miimetiq.ds.writer.${signal.type}.${signal.path}`;
  }

  subscribe(signal, callback) {
    this.connect((err, conn) => {
      conn.createChannel((err, ch) => {
        ch.assertQueue('', null, (err, q) => {
          let callbackWrapper = (msg) => {
            msg.reply = (reply) => this.sendResult(ch, msg, reply);
            return callback(msg);
          };

          let bindingKey = this.getBindingKey(signal);
          let queueName = q.queue;
          ch.bindQueue(queueName, this.exchange, bindingKey);
          // console.log(` [*] Waiting for messages for ${bindingKey}. To exit press CTRL+C`);
          ch.consume(queueName, callbackWrapper, {noAck: true});
        });
      });
    });
  }

  sendResult(channel, msg, reply) {
    let taskId = msg.properties.correlationId,
        replyId = taskId.replace(/\-/g, '');

    // console.log(`Task Queue: ${replyId}`);
    // console.log(`Reply: ${reply}`);

    channel.assertQueue(
      replyId,
      {autoDelete: true, durable: true, arguments: {"x-expires": 60 * 1000}}
    );
    channel.bindQueue(replyId, 'celeryresults', replyId);
    channel.publish(
      'celeryresults',
      replyId,
      new Buffer(reply),
      {contentType: 'application/json'}
    );
  }

}


module.exports = {
  Broker
}
