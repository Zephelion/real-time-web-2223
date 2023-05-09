// var roomId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('id');
const leaveRoomBtn = document.querySelector('.leave-room');
const participants = document.querySelector('.participants');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const previousBtn = document.getElementById('previousBtn');
const lobbySection = document.querySelector('.lobby-container');

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


    socket.on('play', (roomId, uri) => {
        console.log(roomId, uri);
        player.togglePlay();
        // player.play({
        //     uris: [uri]
        // });
    });

    player.addListener('player_state_changed', (state) => {
        if(!state) {
            return;
        }

        const { uri } = state.track_window.current_track;
        // socket.emit('play', roomId, uri);
    })

        
    playBtn.addEventListener('click', (e) => {
        socket.emit('play', roomId, 'spotify:track:2yr2HnFYl7XvqJk4fXoQBt');
        // player.togglePlay();
    });

    nextBtn.addEventListener('click', (e) => {
        player.nextTrack();
    });

    previousBtn.addEventListener('click', (e) => {
        player.previousTrack();
    });

    player.connect();

};


leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leaveRoom', roomId);
});




