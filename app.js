import express from 'express';
import http from 'http';
import session from 'express-session';
import { Server } from 'socket.io';

import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDB } from './config/db.js';

connectDB();

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

// io.on('connection', (socket) => {
//     console.log('A user connected');
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
    
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         io.emit('chat message', msg);
//     })

//     socket.on('typing', () => {
//         console.log('User is typing...');
//         io.emit('typing');
//     })

//     socket.on('stop typing', () => {
//         console.log('User stopped typing...');
//         io.emit('stop typing');
//     });
// });

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});