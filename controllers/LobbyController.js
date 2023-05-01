import express from "express";
import { Lobby } from "../models/Lobby.js";
import { UserLobby } from "../models/UserLobby.js";
import { spotifyApi } from "./UserController.js";
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


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

    const lobby = await Lobby.findById(req.params.id).lean().then(lobby => {
        res.render('lobby', { lobby });
    });
};