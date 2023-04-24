import querystring from 'querystring';
import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';
dotenv.config();

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

export const introduction = (req, res) => {
    res.render('introduction');
};

const spotifyApi = new SpotifyWebApi({
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
    // let state = generateRandomString(16);
    // res.cookie(stateKey, state);
    // let scope = 'user-read-private user-read-email';
    // res.redirect('https://accounts.spotify.com/authorize?' +
    // querystring.stringify({
    //     response_type: 'code',
    //     client_id: clientId,
    //     scope: scope,
    //     redirect_uri: redirect_uri,
    //     state: state
    // }));
};

export const rooms = (req, res) => {
    res.render('rooms');
};

export const test = (req, res) => {
    const code = req.query.code || null;
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const {accestoken, refreshtoken} = data.body;
        spotifyApi.setAccessToken(accestoken);
        spotifyApi.setRefreshToken(refreshtoken);

        res.redirect('/rooms');
        })
        .catch(err => {
            console.log('Something went wrong!', err);
        });
}
