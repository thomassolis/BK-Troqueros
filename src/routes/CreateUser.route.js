import express from 'express';
import { ValidateUserData } from '../middlewares/registerUser.middleware.js';
import { CtrCreateUser } from '../controllers/CreateUserController.js';


const router = express.Router();

router.post('/register', ValidateUserData, CtrCreateUser);

export default router;