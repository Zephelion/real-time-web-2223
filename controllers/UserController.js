import querystring from 'querystring';
import SpotifyWebApi from 'spotify-web-api-node';
import { Lobby } from '../models/Lobby.js';
import * as dotenv from 'dotenv';
dotenv.config();

let session

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

export const introduction = (req, res) => {
    res.render('introduction');
};

export const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: 'http://localhost:3000/callback'
});


const generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


export const login = (req, res) => {
    const scopes = ['user-read-private', 'user-read-email'];
    const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeUrl);
};

export const rooms = (req, res) => {
    Lobby.find().lean().then(lobbies => {
        res.render('rooms', { lobbies });
    });
};

export const saveAccesToken = (req, res) => {
    const code = req.query.code || null;
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const {access_token, refresh_token} = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        session = req.session;
        session.access_token = access_token;

        res.redirect('/rooms');
        })
        .catch(err => {
            console.log('Something went wrong!', err);
        });
}
