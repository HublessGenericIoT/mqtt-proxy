# mqtt-proxy

This works as a proxy between AWS and a local MQTT broker to avoid the security requirements of AWS on your nodes. 

Note: THIS IS NOT SECURED!!! Obviously. 

Before deploying this in a real system, the local MQTT broker should implement some form of security.


## Implementation

In order to prevent infinite sending of a message, this proxy prepends `proxy/` to all message topics both from the upstream (AWS) and downstream (local broker). 

## Installing

Integrating with Docker is on the todo list. 

To get this to connect to your AWS account and broker you need to change two files. 

### Connect to AWS

`client-aws.js` contains the paths to the keys that you need for AWS. This uses the `aws-iot-device-sdk` to connect, which is a wrapper around MQTT.js, and can be found here: https://github.com/aws/aws-iot-device-sdk-js

This currently assumes you have key files in a sibling directory of this repo called `keys/`. 

### Connect to a downstream broker

`mosquitto-client.js` contains the settings for connecting to the downstream broker. The filename mentions Mosquitto which has worked well, but this can be any broker supporting MQTT. The connection is made over MQTT.js. 

#### Mosquitto

##### Mac

Install Homebrew and then run 

````
$ brew install mosquitto
$ screen -S mosquitto
# in the screen instance
$ mosquitto
````

The default settings work fine for development.

##### Linux

No idea. 

### Run the proxy

````
npm install
node index.js
````

The proxy should send a few messages over the wire on startup. 

##### Security

The login information for the local mqtt broker is stored in `private.js` in the project root. That file should look like: 

````
module.exports = {
    url: 'mqtt://0.0.0.0:1883',
    username: "username",
    password: "password",
    clientId: "client id"
};
````

## Contributing

Feel free to contribute to this, just file a PR please.

## TODO

- Ideally this proxy should append a proxy ID to the topics as well so that each user can have their own proxy to enhance security and to prevent this being overloaded with more clients. 
- Docker

## License

MIT for now. 
