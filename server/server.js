const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');

var port = process.env.PORT || 3000;
var publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));


io.on('connection',(socket)=>{
    var info = {};
    socket.on('request', (data)=>{
        var address = data.address;

        var temperature = 0;
        var address_formatted;
        var type;
        var direction = '';
        var windspeed;
        var humidity;
        
        var encodedAddress = encodeURIComponent(address);
        var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD8Ulw0b7Zhjdc6FXqTIS7Yzm27qDSwPSo&address=${encodedAddress}`;
        
        axios.get(geocodeURL).then((response) => {
            if (response.data.status === 'ZERO_RESULTS') {
                throw new Error('Check your address');
            }
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            var weatherURL = `https://api.darksky.net/forecast/28b1921d4fb1a0cdbea598b3c7bc12d6/${lat},${lng}`;
        
            address_formatted = response.data.results[0].formatted_address;
            // var address1 = address_formatted.split(" ");
            // address_formatted = address1[0] + " " + address1[address1.length - 1];
            console.log(address_formatted);
            info['address'] = address_formatted;
        
            return axios.get(weatherURL);
        }).then((response) => {
            temperature = response.data.currently.temperature;
            temperature = (temperature - 32) * (5 / 9);
            temperature = Math.ceil(temperature);
            var apparentTemperature = response.data.currently.apparentTemperature;
            type = response.data.currently.icon;
        
            var windBearing = response.data.currently.windBearing;
        
            if (windBearing > 0 && windBearing < 90) {
                direction = 'NE';
            } else if (windBearing === 90) {
                direction = 'E';
            } else if (windBearing > 90 && windBearing < 180) {
                direction = 'SE';
            } else if (windBearing === 180) {
                direction = 'S';
            } else if (windBearing > 180 && windBearing < 270) {
                direction = 'SW';
            } else if (windBearing === 270) {
                direction = 'W';
            } else if (windBearing > 270 && windBearing < 360) {
                direction = 'NW';
            } else {
                direction = 'N';
            }
            windspeed = Math.ceil(response.data.currently.windSpeed);
            direction = direction + " " + windspeed;
            humidity = (response.data.currently.humidity) * 100;
            pressure = ((response.data.currently.pressure) * 0.02953).toFixed(2);
            console.log(direction);
            console.log(`It's currently ${temperature} It feels like ${apparentTemperature}`);
            console.log(type);
            info['direction'] = direction + ' mph';
            info['humidity'] = humidity + '%';
            info['temperature'] = temperature + '°';
            info['pressure'] = pressure + ' in';
            info['type'] = type;

            socket.emit('information', info);
        
        }).catch((e) => {
            // console.log(e);
            if (e.code === 'ECONNREFUSED') {
                console.log('Cannot connect to API');
            } else if (e.code === 'ETIMEDOUT') {
                console.log('Time Out');
            } else {
                console.log(e.message);
            }
        });
    });

    socket.on('disconnect', ()=>{
        console.log('Disconnected from server');
    });
});

server.listen(port, ()=>{
    console.log(`Server is up at port ${port}`);
});
