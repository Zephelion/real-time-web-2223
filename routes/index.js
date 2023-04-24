import express from 'express';
import { introduction, login, test, rooms } from '../controllers/UserController.js';
import { isloggedIn } from '../middleware/authorization.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/introduction', introduction);
router.get('/login', login);
router.get('/callback', test);
router.get('/rooms',isloggedIn, rooms);




export default router;