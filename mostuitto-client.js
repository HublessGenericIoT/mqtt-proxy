var mqtt    = require('mqtt');
var private = require("./private")

var client  = mqtt.connect(private.url, {
    username: private.username,
    password: private.password,
    clientId: private.clientid
});

module.exports = client;
