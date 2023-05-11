import express from 'express';
import { introduction, login, saveAccesToken, rooms, saveCredentials } from '../controllers/UserController.js';
import { createLobby, connectToLobby, insertCurrentSongThrottle, getCurrentSong } from '../controllers/LobbyController.js';
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
    req.session.acces_token = null;
    res.redirect('/');
});
router.get('/getcurrentsong/:roomId', getCurrentSong);
router.get('/savecredentials', saveCredentials);

router.post('/createLobby', createLobby);
router.put('/currentsong/:currentSong/:roomId', insertCurrentSongThrottle);




export default router;