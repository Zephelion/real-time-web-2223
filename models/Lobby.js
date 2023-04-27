import mongoose from "mongoose";

const LobbySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,

    },
    user: {
        type: String,
        required: true,
    },
});

export const Lobby = mongoose.model('Lobby', LobbySchema);