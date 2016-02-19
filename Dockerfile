FROM node:argon

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

RUN     apt-get update
RUN     apt-get install -y mosquitto
RUN     /usr/sbin/mosquitto -d -c /etc/mosquitto/mosquitto.conf > /var/log/mosquitto.log 2>&1


# Bundle app source
COPY . /src

# Expost Mosquitto port 
EXPOSE 1883 

CMD ["node", "/src/index.js"]