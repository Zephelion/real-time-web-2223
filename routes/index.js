import express from 'express';
import { introduction, login, saveAccesToken, rooms } from '../controllers/UserController.js';
import { createLobby, connectToLobby, insertCurrentSong, insertCurrentSongThrottle } from '../controllers/LobbyController.js';
import { isloggedIn } from '../middleware/authorization.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/introduction', introduction);
router.get('/login', login);
router.get('/callback', saveAccesToken);
router.get('/rooms',isloggedIn, rooms);
router.get('/room', connectToLobby);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/createLobby', createLobby);
router.put('/currentsong/:currentSong/:roomId', insertCurrentSongThrottle);




export default router;