import express from 'express';
import { ctrAuthentication } from '../controllers/AuthCotroller.js';
import ValidateTokenMiddleware from '../middlewares/auth.middleware.js';
import { CleanToken } from '../middlewares/logout.middleware.js'

const router = express.Router();

router.post('/auth/login', ctrAuthentication);

router.post('/home', ValidateTokenMiddleware, (req, res) => {
    res.json({ message: 'Bienvenido al home' });
});

router.post('/loguot', CleanToken);

export default router;