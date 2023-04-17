# Real-Time Web @cmda-minor-web 2022 - 2023
## Description
During this course you will learn how to build a real-time application. You will learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

## Goals
After finishing this program you can:
- _deal with real-time complexity;_
- _handle real-time client-server interaction;_
- _handle real-time data management;_
- _handle multi-user support._

## Week 1
### Socket.io & Express.js
Socket.IO is a popular JavaScript library that enables real-time, bidirectional, event-based communication between the server and the client in web applications. It is used primarily in Node.js applications, including those built with the Express.js framework.

Express.js is a lightweight, flexible framework for building web applications in Node.js. It provides a set of tools and conventions for handling HTTP requests and responses, routing, and middleware.

When used together, Socket.IO and Express.js allow developers to easily add real-time communication capabilities to their web applications.

To use Socket.IO with an Express.js application, you first need to install the Socket.IO library and add it to your project dependencies. You can do this using the npm package manager by running the following command:
`npm install socket.io`

Next, you need to create a Socket.IO server instance and attach it to your Express.js server instance. This is typically done in the same file where you initialize your Express.js server.

Here's an example of how to create I created a socket.io server in my node application.

```javascript
import express from 'express';
import http from 'http';
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

app.engine('hbs', engine({extname: 'hbs'}));
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));


app.use('/', router);

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    })
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
```

At the top I am importing all the necessary packages I need. In this case it was express, express-handlebars, dotenv and my routes. How did I implement socket.io in my application?
```javascript
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    })
});
```
Inside the `connection` event listener, we're listening for a custom event called `chat message`, which is emitted by the client when they send a chat message. When we receive a chat message event, we log the message to the console and broadcast it to all connected clients using the `io.emit()` method.

Finally, we're starting the Express.js server and listening on port 3000 (declared the port in my `.env` file).

On the client side, you can connect to the Socket.IO server using the io() function provided by the Socket.IO library. You can then emit custom events to the server and listen for events emitted by the server.

Here is an example how I handled that on the client side

```javascript
var socket = io();
console.log("hier komt de socket logica");

const messages = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
});
```

easy peasy lemon squeezy amirite :thinking:


## Grading
Your efforts will be graded using a single point rubric (see below). You will have to pass the criterion (centre column) to pass the course. During the test you will be consulted and will be given feedback on things we think deficient and things we think are an improvement on the criterion.

| Deficiency | Criterion | Improvement |
|:--|:--|:--|
|  | *Project* Your app is working and published on Heroku. Your project is thoroughly documented in the `README.md` file in your repository. Included are a description of the data-lifecycle, real-time events and external data source used by your app. |  |
|  | *Complexity* You’ve implemented enough real-time functionality for us to test your comprehension of the subject. A lot of functionality is self-written. You are able to manipulate online examples live. |  |
|  | *Client-server interaction* By interacting with the app, a user can influence the data model of the server in real time by directly modifying data OR by influencing API requests between server and source. The student has set up the data manipulations. |  |
|  | *Data management* The server maintains a data model and each client is continuously updated with the correct data. |  |
|  | *Multi-user support* Multiple clients can connect to the server. Interaction works as expected and is not dependent on the number of clients. You can explain how your app approaches this. |  |


