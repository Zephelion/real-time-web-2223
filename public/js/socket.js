// var roomId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('id');
const leaveRoomBtn = document.querySelector('.leave-room');
const participants = document.querySelector('.participants');
const playBtn = document.getElementById('playBtn');
const lobbySection = document.querySelector('.lobby-container');

console.log(lobbySection.dataset.token)

const script = document.createElement('script');
script.src = "https://sdk.scdn.co/spotify-player.js";
script.async = true;
document.body.appendChild(script);

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = lobbySection.dataset.token;

    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
        
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    player.connect();

    playBtn.addEventListener('click', (e) => {
        player.togglePlay();
    });
};



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
