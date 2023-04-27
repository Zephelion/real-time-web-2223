import { Lobby } from "../models/Lobby.js";
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