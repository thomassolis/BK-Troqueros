import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { CtrVerifyPermission } from '../controllers/VerifyPermissionController.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_SEE), CtrVerifyPermission);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_CREATE), CtrVerifyPermission);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_UPD), CtrVerifyPermission);
router.delete('/delete', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_DEL), CtrVerifyPermission);

export default router;