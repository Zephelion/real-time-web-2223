import express from 'express';
import http from 'http';
// import session from 'express-session';
import cookieSession from 'cookie-session';
import { Server } from 'socket.io';

import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import { UserLobby } from './models/UserLobby.js';
import { Lobby } from './models/Lobby.js';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlencodedParser = express.urlencoded({ extended: true });

import { connectDB } from './config/db.js';

connectDB();

app.use(urlencodedParser);
app.use(express.json());

// app.use(session({

//     secret: process.env.SESSION_SECRET,
  
//     resave: false,
  
//     saveUninitialized: true
  
// }))

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.engine('hbs', engine({extname: 'hbs'}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));


app.use('/', router);

io.on('connection', (socket) => {
    // console.log('A user connected');
    
    socket.on('joinRoom', async (roomId, name) => {

        // const data = await spotifyApi.getMe();
        // console.log(data.body);
        // const name = data.body.display_name;


        socket.join(roomId);
        const lobby = await Lobby.findById(roomId).lean()
        const currentSong = lobby.currentsong;

        io.in(roomId).emit('message', name, roomId, currentSong);

        UserLobby.findOne({ user: name, lobby: roomId}).then((user) => {
            if(!user){
                console.log('User not found')
                const userLobby = new UserLobby({
                    user: name,
                    lobby: roomId,
                });
                userLobby.save().then(() => {
                    console.log(`${name} joined room ${roomId}`);
                });
            }else{
                console.log('User already exists');
                user.socketId = socket.id;
                user.save().then(() => {
                    console.log(`${name} rejoined room ${roomId}`);
                });
            }
        });
    })

    socket.on('leaveRoom', async (roomId, name)  => {
        // const data = await spotifyApi.getMe();
        // const name = data.body.display_name;

        await deleteUser(name, roomId);
        console.log(`${name} left room ${roomId}`)
        socket.to(roomId).emit('leave-room', name, roomId);
        socket.emit('leaveRoom', name, roomId);
    });

    socket.on('disconnect', async () => {
        // const data = await spotifyApi.getMe();
        // const name = data.body.display_name;
        // const roomId = req.params.id;

        // deleteUser(name, roomId);
    });

    socket.on('play', (roomId, uri) => {
        io.to(roomId).emit('play', roomId, uri);

    });

    socket.on('next', (roomId, name) => {
        io.to(roomId).emit('next', roomId, name);
    });

    const deleteUser = async (name, roomId) => {
        try{
            await UserLobby.deleteOne({ user: name, lobby: roomId });
            socket.leave(roomId);
            return
        } catch (error) {
            console.log(error);
        }
    }

    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    })

    socket.on('typing', () => {
        console.log('User is typing...');
        io.emit('typing');
    })

    socket.on('stop typing', () => {
        console.log('User stopped typing...');
        io.emit('stop typing');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});