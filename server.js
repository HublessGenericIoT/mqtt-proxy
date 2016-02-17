var mosca = require('mosca')

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,           //mosca (mqtt) port
  backend: pubsubsettings,   //pubsubsettings is the object we created above
  persistence: {
    factory: mosca.persistence.Mongo,
    url: "mongodb://localhost:27017/mqtt"
  }
};

var server = new mosca.Server(moscaSettings);   //here we start mosca
server.on('ready', setup);  //on init it fires up setup()

server.on('clientConnected', function(client) {
    console.log("Server:", 'client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log("Server:", 'Published', packet.payload);
});
// fired when the mqtt server is ready
function setup() {
  console.log("Server:", 'Mosca server is up and running')

  server.publish({
    topic: "/hello/world",
    payload: "qwerty",
    qos: 0,
    retain: false
  }, function() {
    console.log("Server:", "Publish successful")
  })
}
