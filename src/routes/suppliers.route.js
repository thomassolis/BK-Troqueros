import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetSuppliers } from '../controllers/suppliers/getSuppliersController.js';
import { CtrGetSuppliersId } from '../controllers/suppliers/getSuppliersIdController.js';
import { ValidateDataSuppliersMiddleware } from '../middlewares/suppliers/insertSuppliers.middleware.js';
import { CtrInsertSuppliers } from '../controllers/suppliers/insertSuppliersController.js';
import { CtrUpdateSuppliers } from '../controllers/suppliers/updateSuppliersController.js';
import { CtrDeleteSupplier } from '../controllers/suppliers/deleteSupplierController.js';
import { Mdlware_ValidateDataUpdateSuppliers } from '../middlewares/suppliers/ValidateDataUpdateSupplier.midleware.js';

const MODULE = 'Proveedores';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetSuppliers);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetSuppliersId);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataSuppliersMiddleware, CtrInsertSuppliers);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataUpdateSuppliers, CtrUpdateSuppliers);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteSupplier);

export default router;