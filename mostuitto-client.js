var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:1883');

module.exports = client; 