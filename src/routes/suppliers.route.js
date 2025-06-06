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
import { Ctr_ActivateSupplier } from '../controllers/suppliers/activateSupplierController.js';

const MODULE = 'Proveedores';
const router = express.Router();

// Muestra los proveedores
router.get('/see_suppliers', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetSuppliers);
router.get('/see_supplier_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetSuppliersId);

// Crea un nuevo proveedor
router.post('/add_supplier', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataSuppliersMiddleware, CtrInsertSuppliers);

// Actualiza la información del proveedor
router.put('/update_supplier', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataUpdateSuppliers, CtrUpdateSuppliers);

// Habilita/Deshabilita un proveedor del sistema
router.patch('/activate_supplier', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateSupplier);

//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteSupplier);

export default router;