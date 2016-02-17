var server = require("./server")
var awsconnection = require("./client-aws")
var async = require("async")

awsconnection.on('message', function(topic, payload) {
    console.log('Incoming message from AWS:', topic, payload.toString());
    server.publish(topic, payload); 
});

server.on("message", function(topic, payload) {
    console.log("Incoming message from mosca:", topic, payload.toString()); 
    awsconnection.publish(topic, payload); 
})

server.on('clientConnected', function(client) {
    console.log("Server:", 'client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    
    if(packet.topic.startsWith("$SYS/")) {
        return; 
    }
    
    console.log("Server:", 'Recieved from downstream', packet.payload);
    console.log("Server:", "Packet", JSON.stringify(packet))
    //console.log("Server:", "Client", client)
    
    console.log("Server:", "Sending to AWS")
    awsconnection.subscribe(packet.topic);
    awsconnection.publish(packet.topic, packet.payload, {
        qos: 2,//packet.qos+1, 
        retain: packet.retain
    }, function() {
        console.log("Message was sent to aws.")
    }); 
});

async.parallel([
    function(callback) {
        /*
        An instance of the AWS Device SDK which is an instance of MQTT.js
        */
        awsconnection.on('connect', function() {
            console.log("AWS:", "Connection is ready")
            awsconnection.subscribe('topic_1');
            awsconnection.publish('topic_1', JSON.stringify({ test_data: "Client has started"}));
            callback(null); 
        });
    }, 
    function(callback) {
        server.on('ready', function() {
            console.log("Mosca:", "Server is ready"); 
            callback(null); 
        });  //on init it fires up setup()
    }
], function(err, result) {
    //------- Client Code ---------
    var mqtt    = require('mqtt');
    var client  = mqtt.connect('mqtt://localhost:1883');

    client.on('connect', function () {
        client.subscribe('presence');
        client.publish('presence', 'Hello mqtt');
    });

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log("Client:", message.toString());
    });
}) 