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
module.exports = awsconnection;