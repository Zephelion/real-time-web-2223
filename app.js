import express from 'express';
import http from 'http';
import session from 'express-session';
import { Server } from 'socket.io';

import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import { spotifyApi } from './controllers/UserController.js';
import { UserLobby } from './models/UserLobby.js';

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

app.use(session({

    secret: process.env.SESSION_SECRET,
  
    resave: false,
  
    saveUninitialized: true
  
}))

app.engine('hbs', engine({extname: 'hbs'}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));


app.use('/', router);

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('joinRoom', async (roomId) => {

        const data = await spotifyApi.getMe();
        const name = data.body.display_name;

        socket.join(roomId);
        socket.broadcast.to(roomId).emit('message', name, roomId);

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

    socket.on('leaveRoom', async (roomId)  => {
        const data = await spotifyApi.getMe();
        const name = data.body.display_name;

        deleteUser(name, roomId);
    });

    socket.on('disconnect', async () => {
        // const data = await spotifyApi.getMe();
        // const name = data.body.display_name;
        // const roomId = req.params.id;

        // deleteUser(name, roomId);
    });

    const deleteUser = async (name, roomId) => {
        try{
            await UserLobby.deleteOne({ user: name, lobby: roomId });
            console.log(`${name} left room ${roomId}`);
            socket.leave(roomId);
            socket.broadcast.to(roomId).emit('message', name, roomId);
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