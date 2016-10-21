#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
var miic = require('../mii/connection');
var miid = require('../mii/device');

// var powerSignal = new miid.Signal('power', 'boolean');
// var generator = new miid.Instrument('generator', [powerSignal]);
var dieselGenerator = new miid.Device(
  '6-diesel_generator_schema',
  '56090580e7e466125aa1c0a5',
  [
    ['generator', [['power', 'boolean']]],
    ['saturator', [['lights', 'boolean'], ['battery', 'int']]]
  ]
);

var
  INSTANCE_NAME = "test_dg",
  USERNAME = `${dieselGenerator.model}/${INSTANCE_NAME}`,
  PASSWORD = "anypass";

var callback = function(msg) {
  let body = msg.content,
      taskId = msg.properties.correlationId;

  let reply = JSON.stringify({
    status: 'SUCCESS',
    result: {status: 'OK'},
    task_id: taskId
  });

  msg.reply(reply);
};


// ----------------------------------------------------------------------------
const fs = require('fs');
fs.writeFile('mii_client.pid', String(process.pid));
// console.log('All devices:', miid.repository.allDevices);
var device = miid.repository.getDevice('6-diesel_generator_schema.56090580e7e466125aa1c0a5');
// console.log('All signals:', device.allSignals);
var powerSignal = device.getSignal('generator.power');
var broker = new miic.Broker('localhost', 6772);  // , USERNAME, PASSWORD);
broker.subscribe(powerSignal, callback);
