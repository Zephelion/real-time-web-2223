// var roomId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('id');
const leaveRoomBtn = document.querySelector('.leave-room');
const participants = document.querySelector('.participants');


var socket = io();

if(roomId) {
    socket.emit('joinRoom', roomId);
}

socket.on('message', (name, roomId) => {
    const li = document.createElement('li');
    li.textContent = name;
    participants.appendChild(li);
    console.log(`${name} joined room ${roomId}`);
});

leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leaveRoom', roomId);
});