import express from 'express';
import { ctrAuthentication } from '../controllers/AuthCotroller.js';
import { CtrLogout } from '../controllers/LogoutController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/auth/login',  ctrAuthentication);
router.post('/logout', ValidateTokenMiddleware, CtrLogout);

// Valida que el usuario este autenticado
router.post('validate_token', ValidateTokenMiddleware, (req, res) =>{
    return res.status(200).json({ success: true, message: 'Token válido.' })
})

export default router;