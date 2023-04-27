import express from 'express';
import { introduction, login, saveAccesToken, rooms } from '../controllers/UserController.js';
import { createLobby } from '../controllers/LobbyController.js';
import { isloggedIn } from '../middleware/authorization.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/introduction', introduction);
router.get('/login', login);
router.get('/callback', saveAccesToken);
router.get('/rooms',isloggedIn, rooms);

router.post('/createLobby', createLobby);




export default router;