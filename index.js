require('console-stamp')(console, '[HH:MM:ss.l]');

var mosquittoconnection = require("./mostuitto-client")
var awsconnection = require("./client-aws")
var async = require("async")

mosquittoconnection.on("message", function(topic, message, packet) {
    console.log("Mosquitto Connection:", "Recieved message from mosquitto on", topic);

    if(topic.startsWith("proxy")) {
        console.log("Mosquitto Connection:", "Message was sent from this proxy, ignoring it");
        return;
    }
    topic = "proxy/" + topic;

    console.log("Mosquitto Connection:", "Forwarding message to AWS")
    awsconnection.publish(topic, message, packet /*Acting as options.*/)
})

awsconnection.on("message", function(topic, message, packet) {
    console.log("AWS Connection:", "Recieved message from AWS on", topic)

    if(topic.startsWith("proxy")) {
        console.log("AWS Connection:", "Message was sent from this proxy, ignoring it");
        return;
    }
    topic = "proxy/" + topic;

    console.log("AWS Connection:", "Forwarding message to Mosqiutto");
    mosquittoconnection.publish(topic, message, packet)
})

awsconnection.on("error", function(error) {
    console.log(error);
})

async.parallel([
    function(callback) {
        /*
        An instance of the AWS Device SDK which is an instance of MQTT.js
        */
        awsconnection.on('connect', function() {
            console.log("AWS:", "Connection is ready")
            awsconnection.subscribe("#")
            callback(null);
        });
    },
    function(callback) {
        mosquittoconnection.on('connect', function() {
            console.log("Mosca:", "Server is ready")
            mosquittoconnection.subscribe("#");
            callback(null);
        });  //on init it fires up setup()
    }
], function(err, result) {
    console.log("Connections initialized");
    //------- Client Code ---------
})
