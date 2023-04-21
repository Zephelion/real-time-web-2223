import express from 'express';
import { introduction } from '../controllers/UserController.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/introduction', introduction);




export default router;