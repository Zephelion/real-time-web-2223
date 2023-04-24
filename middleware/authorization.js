// import { spotifyApi } from "../controllers/UserController";

export const isloggedIn = (req, res, next) => {
    const accestoken = req.session.access_token;
    console.log(accestoken);
    if (accestoken) {
        // spotifyApi.setAccessToken(accestoken);
        next();
    }else {
        res.redirect('/');
    }
};