import express from 'express';
import { ValidateUserData } from '../middlewares/registerUser.middleware.js';
import { CtrCreateUser } from '../controllers/CreateUserController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';

const MODULE = 'Usuarios';
const router = express.Router();

router.post('/register', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateUserData, CtrCreateUser);

export default router;