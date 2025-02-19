import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetSuppliers } from '../controllers/suppliers/getSuppliersController.js';
import { CtrGetSuppliersId } from '../controllers/suppliers/getSuppliersIdController.js';
import { ValidateDataSuppliersMiddleware } from '../middlewares/suppliers/insertSuppliers.middleware.js';
import { CtrInsertSuppliers } from '../controllers/suppliers/insertSuppliersController.js';
import { CtrUpdateSuppliers } from '../controllers/suppliers/updateSuppliersController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_PR, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetSuppliers);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_PR, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetSuppliersId);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_PR, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataSuppliersMiddleware, CtrInsertSuppliers);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_PR, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateDataSuppliersMiddleware, CtrUpdateSuppliers);

export default router;