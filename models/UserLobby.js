import mongoose, { Schema } from "mongoose";

const UserLobbySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    lobby: {
        type: Schema.Types.ObjectId, ref: 'Lobby'
    },
});

export const UserLobby = mongoose.model('UserLobby', UserLobbySchema);
