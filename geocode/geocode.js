const request = require('request');

var geocodeAddress = (address, callback) => {
    var encodedAddress = encodeURIComponent(address);

    request({
        url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD8Ulw0b7Zhjdc6FXqTIS7Yzm27qDSwPSo&address=${encodedAddress}`,
        json: true
    }, (error, response, body) => {

        if (error) {
            callback('Unable to connect to Google server');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Check your address')
        } else if (body.status === 'OK') {
            callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng

            });
        }
    });
};

module.exports = {
    geocodeAddress
} 