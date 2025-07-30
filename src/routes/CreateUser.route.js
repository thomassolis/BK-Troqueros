import express from 'express';
import { ValidateUserData } from '../middlewares/registerUser.middleware.js';
import { CtrCreateUser } from '../controllers/CreateUserController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Crea un nuevo usuario en el sistema
router.post('/register', ValidateTokenMiddleware, ValidateUserData, CtrCreateUser);

export default router;