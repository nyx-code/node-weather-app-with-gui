var socket = io();

var text = document.getElementById('searchbox');
var btn = document.getElementById('btn');
var temp = document.getElementsByClassName('weather__header__temperature');
var address = document.getElementsByClassName('weather__header__location')
var humidity = document.getElementsByClassName('humidity');
var pressure = document.getElementsByClassName('pressure');
var direction = document.getElementsByClassName('direction');
var rain = document.getElementById('rain');
var sunny = document.getElementById('sunny');
var cloudy = document.getElementById('cloudy');

rain.style.visibility = 'hidden';
cloudy.style.visibility = 'hidden';
sunny.style.visibility = 'hidden';

socket.on('connect', function(){
    console.log('Connected to server');
    btn.addEventListener('click', fun);
});

function fun(event) {
    event.preventDefault();
    socket.emit('request', {
        address: text.value
    });

    socket.on('information', (data)=>{
        console.log(data);

        if (data.type === 'cloudy' || data.type === 'partly-cloudy-night' || data.type === 'partly-cloudy-day' || data.type === 'wind' || data.type === 'fog') {
            temp[1].textContent = data.temperature;
            address[1].textContent = data.address;
            humidity[1].textContent = data.humidity;
            pressure[1].textContent = data.pressure;
            direction[1].textContent = data.direction;
            rain.style.visibility = 'hidden';
            sunny.style.visibility = 'hidden';
            cloudy.style.visibility = 'visible';
        } else if (data.type === 'rain' || data.type === 'snow' || data.type === 'sleet') {
            temp[2].textContent = data.temperature;
            address[2].textContent = data.address;
            humidity[2].textContent = data.humidity;
            pressure[2].textContent = data.pressure;
            direction[2].textContent = data.direction;
            cloudy.style.visibility = 'hidden';
            sunny.style.visibility = 'hidden';
            rain.style.visibility = 'visible';
        } else if (data.type === 'clear-day' || data.type === 'clear-night') {
            temp[0].textContent = data.temperature;
            address[0].textContent = data.address;
            humidity[0].textContent = data.humidity;
            pressure[0].textContent = data.pressure;
            direction[0].textContent = data.direction;
            rain.style.visibility = 'hidden';
            cloudy.style.visibility = 'hidden';
            sunny.style.visibility = 'visible';
        }

        // temp[0].textContent = data.temperature;
        // address[0].textContent = data.address;
        // humidity.textContent = data.humidity;
        // pressure.textContent = data.pressure;
        // direction.textContent = data.direction;
    });
}

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});