const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var geocode = require('./../geocode/geocode');
var weather = require('./../weather/weather');

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

         geocode.geocodeAddress(address, (errorMessage, result) => {
                if (errorMessage) {
                    console.log(errorMessage);
                } else {
                    info['address'] = result.address;
                    // console.log(result.address);
                    weather.getWeather(result.latitude, result.longitude, (errorMessage, wResult) => {
                        if (errorMessage) {
                            console.log(errorMessage);
                        } else {
                            info['temperature'] = wResult.temperature;
                            info['apparentTemp'] = wResult.apparentTemperature;
                            console.log(wResult);
                        }

                        socket.emit('information', info);
                    });   
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

