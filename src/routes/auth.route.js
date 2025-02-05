import express from 'express';
import { ctr_authentication } from '../controllers/AuthCotroller.js';
import validarTokenMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/auth/login', ctr_authentication);

router.post('/home', validarTokenMiddleware, (req, res) => {
    res.json({ message: 'Bienvenido al home' });
});

export default router;