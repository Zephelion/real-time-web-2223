// var roomId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('id');


var socket = io();

if(roomId) {
    socket.emit('joinRoom', roomId);
}

socket.on('message', (name, roomId) => {
    console.log(`${name} joined room ${roomId}`);
});