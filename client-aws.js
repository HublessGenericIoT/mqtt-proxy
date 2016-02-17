var awsIot = require('aws-iot-device-sdk');

var fs = require('fs');
var KEY = '../keys/privateKey.pem';
var CERT = '../keys/cert.pem';
var TRUSTED_CA = '../keys/rootCA.pem';


var awsconnection = awsIot.device({
   keyPath: KEY,
  certPath: CERT,
    caPath: TRUSTED_CA,
  clientId: 'myAwsClientId',
    region: 'us-east-1'
});

//
// Device is an instance returned by mqtt.Client(), see mqtt.js for full
// documentation.
//
awsconnection
  .on('connect', function() {
    console.log('connect');
    awsconnection.subscribe('topic_1');
    awsconnection.publish('topic_1', JSON.stringify({ test_data: 1}));
    });

awsconnection
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
