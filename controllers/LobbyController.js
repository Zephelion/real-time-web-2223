import { Lobby } from "../models/Lobby.js";

export const createLobby = async (req, res) => {

    console.log(req.body);
    const { name, description } = req.body;
    const lobby = new Lobby({
        name,
        description
    });
    try {
        await lobby.save();
        res.redirect('/rooms');
    } catch (error) {
        console.log(error);
    }
};