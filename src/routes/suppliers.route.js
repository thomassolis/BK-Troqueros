import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetSuppliers } from '../controllers/suppliers/getSuppliersController.js';
import { CtrGetSuppliersId } from '../controllers/suppliers/getSuppliersIdController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetSuppliers);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetSuppliersId);

export default router;