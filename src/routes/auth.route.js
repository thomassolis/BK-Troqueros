import express from 'express';
import { ctrAuthentication } from '../controllers/AuthCotroller.js';
import { CtrLogout } from '../controllers/LogoutController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/auth/login',  ctrAuthentication);
router.post('/logout', ValidateTokenMiddleware, CtrLogout);

export default router;