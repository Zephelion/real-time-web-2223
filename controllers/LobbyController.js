import { Lobby } from "../models/Lobby.js";
import { UserLobby } from "../models/UserLobby.js";
import { spotifyApi } from "./UserController.js";



export const createLobby = async (req, res) => {

    const data = await spotifyApi.getMe();

    console.log(data);

    const { name, description } = req.body;
    const lobby = new Lobby({
        name,
        description,
        user: data.body.display_name,
    });
    try {
        await lobby.save();
        res.redirect('/rooms');
    } catch (error) {
        console.log(error);
    }
};

export const connectToLobby = async (req, res) => {
    // console.log(req.query.id);
    
    UserLobby.find({ lobby: req.query.id }).lean().then(async users => {
        const lobby = await Lobby.findById(req.query.id).lean().then(async lobby => {
            const data = await spotifyApi.getMySavedTracks();
            console.log(data.body.items);


            res.render('lobby', { lobby, users, token: req.session.access_token });
            // if(users.length > 0) {
            //     console.log(users);
            // }else{
            //     console.log('No participants currently in this room');
            // }
        });
    });

    // const lobby = await Lobby.findById(req.query.id).lean().then(lobby => {
    //     res.render('lobby', { lobby });
    // });
};