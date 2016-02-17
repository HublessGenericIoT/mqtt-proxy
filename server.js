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
    url: pubsubsettings.url
  }
};

var server = new mosca.Server(moscaSettings);   //here we start mosca

module.exports = server; 