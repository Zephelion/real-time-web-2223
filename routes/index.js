import express from 'express';
import { introduction, login, test, rooms } from '../controllers/UserController.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/introduction', introduction);
router.get('/login', login);
router.get('/callback', test);
router.get('/rooms', rooms);




export default router;