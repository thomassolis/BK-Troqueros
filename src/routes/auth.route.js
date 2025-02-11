import express from 'express';
import { ctrAuthentication } from '../controllers/AuthCotroller.js';
import { CleanToken } from '../middlewares/logout.middleware.js'
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { CtrHome } from '../controllers/HomeController.js';
import { CtrLogout } from '../controllers/LogoutController.js';

const router = express.Router();

router.post('/auth/login', ctrAuthentication);
router.post('/home', ValidateTokenMiddleware, CtrHome);
router.post('/loguot', CleanToken, CtrLogout);

export default router;