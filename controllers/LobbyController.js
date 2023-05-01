import { Lobby } from "../models/Lobby.js";
import { UserLobby } from "../models/UserLobby.js";
import { spotifyApi } from "./UserController.js";



export const createLobby = async (req, res) => {

    const data = await spotifyApi.getMe();

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

    const lobby = await Lobby.findById(req.query.id).lean().then(lobby => {
        res.render('lobby', { lobby });
    });
};