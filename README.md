# Real-Time Web @cmda-minor-web 2022 - 2023
## Description
During this course you will learn how to build a real-time application. You will learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

## Installation :rocket:

## Link
In order to use this application you must have **Spotify Premium**

Click the link below in order to use the application. In order to use some of the functionality you need to contact me (Russell Numo). Because I need to add you to the dashboard or if you dont have spotify premium you may also use my account :).
[SyncMusic](https://real-time-web-2223-production-0bfa.up.railway.app/)

### locally

Clone the repository with the command below
```
git clone https://github.com/Zephelion/real-time-web-2223.git
```

Set your environment variables
```
PORT="3000"
CLIENT_ID=""
CLIENT_SECRET=""
SESSION_SECRET=""
CONNECTION_STRING=""
```

In order to get the CLIENT_ID and CLIENT_SECRET you must register your application at the spotify developer dashboard.
To get a CONNECTION_STRING you need to make a database in mongodb.

In order for other users to acces the app you must added them in the developer dashboard.


| Add user |
|:---:|
|![AddUser](/public/images/developer.png)|

This allows them to use the player. Dont forget to put your redirectURI
| Add redirectURIS |
|:---:|
|![AddUser](/public/images/redirecturi.png)|

Lastly run `npm install` in order to get all the needed dependencies.

and then run `npm run dev`.

Voila I guess. If it doesn't work put it in rice.



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

easy peasy lemon squeezy amirite :thinking:.

Next I tried to create a user is typing functionality with sockets. I first started by creating an `keydown` event listener in my client side that checks whenever a user has typed in the input field. I used a debounce functionality to make it little bit more functional.

```javascript
input.addEventListener('keydown', () => {
    if(!typingTimeout) {
        // typing = true;
        socket.emit('typing');
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingTimeout = null;
        socket.emit('stop typing');
    }, 500);
});

socket.on('typing', () => {
    console.log('User is typing...');
    divTyping.classList.add('visible');
});
```
and whenever a user is typing something I add to the `divTyping ` element a class with visibible and thats it.

Thats what I did for this week :thumbs_up:.

## Week 2
This week I decided to start thinking about my concept and what I wanted to make.

## Concept
![Syncmusic](/public/images/Scherm%C2%ADafbeelding%202023-05-12%20om%2000.24.42.png)

I called my concept **SyncSound** basically what I want to achieve is that users can listen music together and that will be happening real time. In order to realise this concept I will mainly be using the Spotify API in order to play music.

## Spotify Web Api
| Spotify Web Api|
|:-----:|
|![SpotifyWebApi](/public/images/spotifyapi.png)|
The Spotify API is an application programming interface (API) that allows developers to access data and functionality from the Spotify music streaming service. The API provides various endpoints that allow developers to retrieve information about artists, albums, tracks, playlists, and more.

By using the Spotify API, developers can integrate Spotify's music streaming capabilities into their own applications and services, and create new features and experiences based on the data provided by the API. For example, developers could use the API to create music recommendation systems, build music analysis tools, or develop custom playlist generators.

The Spotify API uses the REST (Representational State Transfer) architecture, which means that it communicates with HTTP requests and responses. The API also requires authentication to access protected resources, which can be done using OAuth2.

Overall, the Spotify API is a powerful tool that enables developers to create innovative and exciting music-related applications and services.

You're now wondering how did I setup the Spotify Web api :thinking: I will try to explain it throughly.

### Spotify Api Setup
1. First I had to register my webapplication with spotify and obtain some client credentials

| Spotify Web Api|
|:-----:|
|![Step1](/public/images/setup1.png)|
Obviously I called the application SyncMusic

2. To make the process a liltle bit easier I used the `spotify-web-api-node` which is a node_module to make interacting with the Spotify Web Api a little bit easier. How did I use it in my code?

```javascript
// Creates a new instance of the SpotifyWebApi class
export const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: 'https://real-time-web-2223-production-0bfa.up.railway.app/callback'
});
```

The `clientId` and the `clientSecret` are being pulled from my `.env` file

3. The next step was to actually authenthicate the user through my webapplication. For this I create a simple landing page in order to do that.

```html
<section class="introduction">
    <h2>Get started</h2>
    <a href="/login">Login with spotify</a>
</section>

```

When a user clicks on the link the person will hit the login route in my application. You might be wondering what are routes? Here is a brief explanation what routes are.

### Routes Explanation
In Node.js, a route refers to a way of mapping incoming requests from clients to specific actions or handlers in a web application.

Routes are defined using the HTTP method (such as GET, POST, PUT, DELETE, etc.) and the URL path of the request. When a request matches a specific route, the corresponding handler function is executed to handle the request and generate a response.

For example, in my application I am making an HTTP GET request to "/login" I define a route for the request like this.

```javascript
router.get('/login', login);
```

So when a user hits the route `login` a function is called that handles the request in this case also called `login`.

Still following :eyes:?.

The login function
```javascript
export const login = (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-library-read', 'user-library-modify', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'streaming'];
    const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(authorizeUrl);
};
```

The `scopes` available in the Spotify API are defined by the endpoints that the application intends to use. For example, to access a user's playlists, an application must request the playlist-read-private or playlist-read-collaborative scope.
Scopes are requested by an application in the authorization flow and are returned as a part of the access token, which is used to authenticate API requests. If an application attempts to access an endpoint without the necessary scope, the API will return an error. Learned this the hard way.

Finally I used `res.redirect(authorizeUrl)` to hit another route the authorize url is actually `/callback` you need to actually put the `redirectUri` in the spotify developer dashboard or else it wont work.

| Spotify dashboard |
|:---:|
|![Dashboard](/public/images/redirecturi.png)|

When the user hits the `/callback` route the `saveAccesToken` function is called.

```javascript
export const saveAccesToken = (req, res) => {
    const code = req.query.code || null;
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const {access_token, refresh_token} = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        session = req.session;
        session.access_token = access_token;

        spotifyApi.getMe().then(data => {

            res.redirect('/savecredentials?name=' + data.body.display_name);
        })

        })
        .catch(err => {
            console.log('Something went wrong!', err);
        });
}
```

To quickly go over this piece of code it basically takes in two parameters, `req` and `res`, which are the request and response objects from an HTTP request.

It first retrieves a `code` parameter from the request query string, or sets it to null if it's not present. It then uses the `spotifyApi.authorizationCodeGrant` method to exchange the code for an access token and a refresh token.

The access token and refresh token are stored in the `spotifyApi` object using the `spotifyApi.setAccessToken` and `spotifyApi.setRefreshToken` methods.

The function then saves the access token in the `req.session.access_token` property.

Finally, it uses the `spotifyApi.getMe` method to retrieve the current user's display name and redirect the user to a `/savecredentials` endpoint with the `display_name` parameter as part of the URL.

If there's an error during the process, it will log an error message to the console.

Later I will go over why I have a `/savecredentials` route. But that aside if everything goes correctly the user will then hit the `/rooms` route defined like this.

```javascript
router.get('/rooms',isloggedIn, rooms);
```

Notice how there is a `isLoggedIn` function this is a middleware I used to check whether a user has an accestoken in there session. If the user has no acces token he/she will be redirected back to the landing page.

`isLoggedIn`
```javascript
export const isloggedIn = (req, res, next) => {
    const accestoken = req.session.access_token;
    if (accestoken) {
        // spotifyApi.setAccessToken(accestoken);
        next();
    }else {
        res.redirect('/');
    }
};
```

If the user has a acces token in there session the `next()` function will be called and then the second function will be invoked and the function is called `rooms`

```javascript
export const rooms = (req, res) => {

    Lobby.find().lean().then(lobbies => {
        res.render('rooms', { lobbies });
    });
};
```

This function basically renders a new view called rooms I also send a lobbies object where I will go over later. This was the entirety of step 3 crazy right?

### Quick Summary
So if I had to summarize it real quick a user login using there spotify account and they are redirected to `/rooms` that renders out a view called `rooms`.

![Rooms](/public/images/rooms.png)

## Week 2
This I decided to tackle creating a room/lobby and being able to leave and join them.

### Create Lobby and save
Lets get started with the first step creating a room. This was arguably the easiest step. In my rooms view I have a litle plus button at the top when this is clicked a modal opens.

| Modal Open |
|:---:|
|![Modal](/public/images/modal.png)|
I wont explain the concept of opening a modal because its quite explanatory.
This modal is a form that will hit a certain route.

```html
<form action="/createlobby" method="post">
    <label for="roomName">Room name</label>
    <input type="text" name="name" id="roomName" placeholder="Room name" required>

    <label for="roomDescription">Room description</label>
    <input type="text" name="description" id="roomDescription" placeholder="Room description" required>

    <button type="Submit">Create room</button>
</form>
```

When the user submits this he/she will hit the `/createlobby` route defined as followed
```javascript
router.post('/createLobby', createLobby);
```
This will then call the `createLobby` function that will do some stuff

The `createLobby` function
```javascript
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
```

I know you must be confused what happens here let me explain.

The function first calls the `spotifyApi.getMe()` method to retrieve information about the currently authenticated user from the Spotify API. This is an asynchronous operation that returns a Promise, which is awaited using the `await` keyword.

The function then extracts the `name` and `description` properties from the `req.body` object, which should contain the data submitted in a form by the user. It creates a new instance of the `Lobby` model using these properties, along with the user's display name obtained from the Spotify API response.

Finally, the function attempts to save the new lobby to the database using the `lobby.save()` method, which is also asynchronous and returns a Promise. If the save operation succeeds, the function redirects the user to the `/rooms` page using the `res.redirect()` method. If an error occurs, it is logged to the console.

Notice `Lobby` model I will quickly go over what a model actually is. I hope this explanation will give you a better idea about my code anyway lets delve quickly into models.

### Models
In a typical web application, a model defines the schema and methods that are used to create, read, update, and delete data from a database. Models provide a layer of abstraction between the application and the database, allowing developers to work with objects and properties instead of raw SQL statements.

In Node.js, popular libraries such as Mongoose and Sequelize provide tools for defining and working with models. Mongoose is an Object-Document Mapping (ODM) library for MongoDB, while Sequelize is an Object-Relational Mapping (ORM) library for SQL databases.

To define a model using Mongoose, for example, you would typically create a schema that describes the structure of the data, including its properties and data types, and then create a model that is based on that schema. Here's an example how I created a Lobby model:

```javascript
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
    currentsong: {
        type: String,
    },
});

export const Lobby = mongoose.model('Lobby', LobbySchema);
``` 

The `mongoose` module is imported using ES6 syntax, and a new `LobbySchema` is created using the `mongoose.Schema` constructor. The `LobbySchema` defines the structure of a lobby object, including the properties `name`, `description`, `user`, and `currentsong`.

The `name` and `description` properties are both of type `String` and are required, meaning that an error will be thrown if these properties are missing when creating a new `Lobby` object. The `user` property is also required and represents the display name of the user who created the lobby.

The `currentsong` property is optional and represents the song currently playing in the lobby. It is of type `String`, but could potentially be changed to an object representing a song or track.

Finally, a Mongoose model is created using the `mongoose.model` method, which takes two arguments: the name of the model (in this case, "Lobby"), and the schema that the model should use (`LobbySchema`). This model is then exported using the `export` statement, allowing it to be used in other parts of the application.

So to quickly go over it a user gives a lobby name and description from the modal that creates a new lobby object and save it in the database :eyes:.

### Database
Database are simply used to store persistent information in a table I used `MongoDB` in order to create a database. I wont go over how to create a database but I can explain how I configured it.

```javascript
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

export const connectDB = () =>{
    try{
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log('DB - connected')
    }   catch(err){
        console.log('error occured while trying')
        throw err;
    }
};
```

The code first imports the `mongoose` module and the `dotenv` module, which is used to load environment variables from a `.env` file in the root directory of the application. The `connectionString` variable is then initialized with the value of the `CONNECTION_STRING` environment variable, which should contain the URL of the MongoDB database.

The `connectDB` function attempts to connect to the database using the `mongoose.connect` method, which takes the `connectionString` as its first argument and an options object as its second argument. The options object includes the `useNewUrlParser` and `useUnifiedTopology` options, which are both set to `true`. These options are required to avoid deprecation warnings and ensure compatibility with newer versions of MongoDB.

If the connection is successful, the function logs a message to the console indicating that the database is connected. If an error occurs, the function logs an error message to the console and throws the error.
 
I then call the function in `app.js`

In order to display all the lobbies I simply run a foreach but before that I need to pass the lobbies to the rooms view remembere how I would go over this :hushed:

```javascript
export const rooms = (req, res) => {

    Lobby.find().lean().then(lobbies => {
        res.render('rooms', { lobbies });
    });
};
```


Inside the function, it uses the `Lobby.find()` method to retrieve all the documents from the `Lobby` collection in a MongoDB database. The `lean()` method is called on the query result to convert it into a plain JavaScript object.

Once the `lobbies` data is retrieved, it's passed to the `res.render` method along with the `rooms` view template name. The `lobbies` data will be available inside the view template as a local variable with the same name.

The `res.render` method is used to render a view template with the specified name and data, and send the resulting HTML back to the client as a response. 

In the rooms template I do a foreach to loop over the array of objects

```html
<ul class="lobbies">
    {{#each lobbies}}
    <li>
        <a class="join" href="/room?id={{_id}}">{{name}}</a>
        <p>{{description}}</p>
        <p>Created by:{{user}}</p>
    </li>
    {{/each}}
</ul>
```

and thats how I display all the lobbies.

### Joining a lobby
Well here is where sockets are introduced this is actually one of the harder things to implement but I will go over how I did it remembered how a user could create lobbies well each of those lobbies have a unique `_objectID` I will be using that in order to differentiate the different lobbies.

Starting first from the UI

```html
{{#each lobbies}}
<li>
    <a class="join" href="/room?id={{_id}}">{{name}}</a>
    <p>{{description}}</p>
    <p>Created by:{{user}}</p>
</li>
{{/each}}
```

When the user clicks on a room I pass the ID in the url. Then in my client side javascript.

```javascript
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const roomId = urlParams.get('id');
```

I want to get the parameter that is called `id`. I then stop it in a variable
Then I check whether the roomId variable exists if it exists emit `joinRoom` 
```javascript
if(roomId) {
    socket.emit('joinRoom', roomId, localStorage.getItem('name'));
}
```

I pass the roomID and a name that resides in the localstorage. I will go over why I used localstorage to pass the name. 

In my `app.js`

```javascript
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
```

The function takes in two parameters, `roomId` and `name`, which are the ID of the room being joined and the name of the user joining, respectively.

Inside the function, it first joins the current socket to the specified `roomId` using the `socket.join` method. This allows the user to receive and emit messages to other users in the same room.

It then retrieves the lobby data corresponding to the `roomId` from the MongoDB database using the `Lobby.findById` method, and stores it in the `lobby` variable. The `lean()` method is called on the query result to convert it into a plain JavaScript object.

The function then emits a 'message' event to all clients in the `roomId` room using the `io.in` method, passing along the `name`, `roomId`, and `currentSong` data from the `lobby`.

Next, it checks if the `UserLobby` collection in the MongoDB database already contains a document for the current user in the current room using the `UserLobby.findOne` method. If the user doesn't exist, a new document is created and saved to the database, indicating that the user has joined the room. If the user already exists, the `socketId` property of the existing document is updated with the current socket's ID to indicate that the user has rejoined the room.

Finally, console logs are printed to indicate whether the user is joining the room for the first time or rejoining it. 

The `UserLobby` is a model that basically saves the username and the ID of the room in a single record you could see it as a kind of pivot table. I used in order to keep track which user has joined which room. I think that this way worked for me the best because I was already familiar with this.

`socket.on(message)`

```javascript
socket.on('message', (name, roomId, currentSong) => {
    console.log('Song currently playing: ', currentSong);
    const li = document.createElement('li');
    li.textContent = name;
    participants.appendChild(li);
    console.log(`${name} joined room ${roomId}`);
});
```

Ta-da This is how I was able to implement the join functionality.

| Room |
|:---:|
|![Room](/public/images/room.png)|
To showcase the room as reference.

The user can obviously also leave a room I will quckly go over how I implemented it.

client side javascript

```javascript
leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leaveRoom', roomId, localStorage.getItem('name'));
});
```

app.js 

```javascript
socket.on('leaveRoom', async (roomId, name)  => {
    // const data = await spotifyApi.getMe();
    // const name = data.body.display_name;

    await deleteUser(name, roomId);
    console.log(`${name} left room ${roomId}`)
    socket.to(roomId).emit('leave-room', name, roomId);
    socket.emit('leaveRoom', name, roomId);
});
```

`deleteUser` is a function that deletes the relation between the user and the room. and lets the user leave the room

```javascript
const deleteUser = async (name, roomId) => {
    try{
        await UserLobby.deleteOne({ user: name, lobby: roomId });
        socket.leave(roomId);
        return
    } catch (error) {
        console.log(error);
    }
}
```

Then again in my client side 

```javascript
socket.on('leave-room', (name, roomId) => {
    console.log(`${name} left room ${roomId}`);
    const participantList = document.querySelectorAll('ul.participants li');

    participantList.filter((participant) => {
        if(participant.textContent === name) {
            console.log('Participant found');
            participant.remove();
        }
    });
});
```

When a user leaves the room they the list that keeps track of all the user will remove the li element.

I think this covers all I have done this week. This was definitely challenging to make but it all worked.

## Week 3
This week I wanted to deploy and actually create the ability to play music in lobbies.

### Configuring Spotify Webplayer SDK
With the Spotify Player SDK, developers can create web and mobile applications that allow users to listen to Spotify music and control playback without leaving the application.

The SDK provides APIs to control playback, including starting and stopping songs, skipping to the next or previous track, and adjusting the volume. It also allows developers to retrieve metadata about tracks, albums, and artists, such as cover art, track names, and artist information.

The Spotify Player SDK uses web technologies such as HTML, CSS, and JavaScript to create a customizable and responsive user interface that can be integrated into any application. The SDK also supports multiple platforms, including iOS, Android, and web browsers.

Overall, the Spotify Player SDK makes it easier for developers to create applications that integrate with the Spotify platform, allowing users to access and play their favorite music seamlessly within the context of the application.

First I need to set the player up in my client side.

```javascript
const script = document.createElement('script');
script.src = "https://sdk.scdn.co/spotify-player.js";
script.async = true;
document.body.appendChild(script);
```

Next I had to create a new instance of the player.
```javascript
const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); }
    
});
```

This code initializes a new instance of the `Spotify.Player` object using the `new` keyword and passing in an object with two properties:

1. `name`: This is a string that sets the name of the player. In this case, it is set to 'Web Playback SDK Quick Start Player'.

2. `getOAuthToken`: This is a function that takes a callback function as a parameter and calls that callback function with an access token as an argument. The access token is passed in as the `token` variable.

The `Spotify.Player` object is part of the Spotify Web Playback SDK, which is a JavaScript library that provides a way to play Spotify music in a web browser using the Spotify Web API. 

By initializing a new `Spotify.Player` object, this code sets up a new instance of the Spotify Web Playback SDK that is ready to play music. The `getOAuthToken` function is used to retrieve an access token from the Spotify API, which is required to access and play music. Once the access token is retrieved, the player can use it to authenticate and play music on behalf of the user.

I passed the token from the backend to the fronend (I wont explain how a liltle bit hacky).

Then I had to ready the player. I used the ready event in order to configure that

```javascript
player.addListener('ready', async ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            device_ids: [device_id],
            play: false,
        }),
    });
}
```

This code sets up a listener for the `'ready'` event emitted by the `player` object. The `'ready'` event is triggered when the player is ready to start playing music.

When the `'ready'` event is triggered, the listener function is called with an object containing a `device_id` property. The `device_id` is a unique identifier for the device on which the player is running, and it is used to control the player.

In this code, the `console.log` statement logs the `device_id` to the console, indicating that the player is ready and providing the `device_id` for future use.

After logging the `device_id`, the code makes an HTTP PUT request to the Spotify Web API at the `/me/player` endpoint. This request updates the player's current playback device to the device with the `device_id` obtained from the `'ready'` event. 

The request includes an `Authorization` header with the access token, which is required to authenticate the request with the Spotify API. 

The `body` of the request is a JSON object that sets the `device_ids` property to an array containing the `device_id` obtained from the `'ready'` event. It also sets the `play` property to `false`, indicating that the player should not start playing music immediately.

After doing all of this the player is ready.

In order to play music I used the `togglePlay()` function. It also obviously needs to work in real time.

```javascript
playBtn.addEventListener('click', async (e) => {
    socket.emit('play', roomId, 'spotify:track:2yr2HnFYl7XvqJk4fXoQBt');
    // player.togglePlay();
});
```

When the user clicks the play button in the UI this emits a `play` eventlistener to the server side.

```javascript
socket.on('play', (roomId, uri) => {
    // console.log(roomId, uri);
    io.to(roomId).emit('play', roomId, uri);

});
```

After receiving the `'play'` event, the listener function emits another `'play'` event to all clients in the same `roomId` using the `io.to(roomId).emit()` method. 

The `'play'` event emitted by the listener function includes the `roomId` and `uri` arguments as parameters, which are passed on to the client-side event listener. 

the `'play'` event is used to synchronize music playback across all clients in a given room.

In my client side I receive the `play` event.

```javascript
socket.on('play', (roomId, uri) => {
    player.togglePlay();
    player.getCurrentState().then(async state => {
        console.log(state);
        currentSong = state.track_window.current_track.uri;
        console.log(currentSong);
        await fetch(`/currentsong/${currentSong}/${roomId}` , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentSong,
            }),
        })

    });
});
```

Then I play the song. I also wanted to current state of the song so that I can track which song is playing. I then do a fetch to my backend in order to send currentsong belonging to a room. This ensures when a user joins a room the same song will be played. The code below kinda demonstrates it.

```javascript
const response = await fetch (`/getcurrentsong/${roomId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
})
const data = await response.json();
currentSong = data.currentSong;


await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
        uris: [currentSong],
        play: false,
    }),
});
```

And thats how the play functionality works.

## Diagram(scribbled)
|Diagram|
|:----:|
|![Diagram](/public/images/sockets.jpeg)|


### Missed out oppurtunities
This application was quite difficult to make but do-able. Because I was playing alot with the spotify api in order to get things working I didn't had much time to make it more whole.

List of things that I wanted to add
* Sync the timestamp to match that of everybody
* Make the UI stack more nicer
* Being able to select music within the webapplication itself
* Maybe a small chat function (this would be do-able to be honest)
* Next and previous button should work in realtime aswell (to be fair also do-able)
* Change the UI based on what song is playing

These are some of the more notable things that I wanted to add to the webapplication but due to time constraint I had no time to implement some of these features.






<!-- ## Grading
Your efforts will be graded using a single point rubric (see below). You will have to pass the criterion (centre column) to pass the course. During the test you will be consulted and will be given feedback on things we think deficient and things we think are an improvement on the criterion.

| Deficiency | Criterion | Improvement |
|:--|:--|:--|
|  | *Project* Your app is working and published on Heroku. Your project is thoroughly documented in the `README.md` file in your repository. Included are a description of the data-lifecycle, real-time events and external data source used by your app. |  |
|  | *Complexity* You’ve implemented enough real-time functionality for us to test your comprehension of the subject. A lot of functionality is self-written. You are able to manipulate online examples live. |  |
|  | *Client-server interaction* By interacting with the app, a user can influence the data model of the server in real time by directly modifying data OR by influencing API requests between server and source. The student has set up the data manipulations. |  |
|  | *Data management* The server maintains a data model and each client is continuously updated with the correct data. |  |
|  | *Multi-user support* Multiple clients can connect to the server. Interaction works as expected and is not dependent on the number of clients. You can explain how your app approaches this. |  | -->


