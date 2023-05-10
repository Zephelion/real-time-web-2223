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
            // const data = await spotifyApi.getMySavedTracks();
            console.log(req.session.access_token);
            res.render('lobby', { lobby, users, token: req.session.access_token });
        });
    });

    // const lobby = await Lobby.findById(req.query.id).lean().then(lobby => {
    //     res.render('lobby', { lobby });
    // });
};

const throttle = (func, limit) => {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
        }
    }
}

export const insertCurrentSong = async (req, res) => {
    const currentSong = req.params.currentSong;
    const roomId = req.params.roomId;

    console.log(currentSong);
    
    Lobby.findById(roomId).then(lobby => {
        lobby.currentsong = currentSong;
        lobby.save().then(() => {
            res.status(200).json({ message: 'Current song updated' });

        });
    });
};

export const insertCurrentSongThrottle = throttle(insertCurrentSong, 5000);