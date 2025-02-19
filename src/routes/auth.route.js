import express from 'express';
import { ctrAuthentication } from '../controllers/AuthCotroller.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { CtrLogout } from '../controllers/LogoutController.js';

const router = express.Router();

router.post('/auth/login',  ctrAuthentication);
router.post('/loguot', CtrLogout);

export default router;