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

let currentSong;

if(roomId) {
    socket.emit('joinRoom', roomId);
}

if(currentSong) {
    console.log('Current song is: ' + currentSong);
}

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

    player.addListener('ready', async ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        await fetch(`https://api.spotify.com/v1/me/player`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                device_ids: [device_id],
                play: false,
            }),
        });
    });


    socket.on('play', (roomId, uri) => {
        player.togglePlay();
        player.getCurrentState().then(async state => {
            console.log(state);
            currentSong = state.track_window.current_track.uri;
            console.log(currentSong);
            await fetch(`/currentsong/${currentSong}/${roomId}` , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentSong,
                }),
            })
        });
    });

    socket.on('message', (name, roomId, currentSong) => {
        console.log('Song currently playing: ', currentSong);
        const li = document.createElement('li');
        li.textContent = name;
        participants.appendChild(li);
        console.log(`${name} joined room ${roomId}`);
    });

    player.addListener('player_state_changed', (state) => {
        if(!state) {
            return;
        }
        // const { uri } = state.track_window.current_track;
        // socket.emit('play', roomId, uri);
    })

        
    playBtn.addEventListener('click', async (e) => {
        socket.emit('play', roomId, 'spotify:track:2yr2HnFYl7XvqJk4fXoQBt');
        // player.togglePlay();
    });

    nextBtn.addEventListener('click', (e) => {
        player.nextTrack().then(() => {
            player.getCurrentState().then(async state => {
                const currentSong = state.track_window.current_track.uri;
                console.log(currentSong);
                await fetch(`/currentsong/${currentSong}/${roomId}` , {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentSong,
                    }),
                })
            });
        });
    });

    previousBtn.addEventListener('click', (e) => {
        player.previousTrack();
    });

    player.connect();

};


leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leaveRoom', roomId);
});




