import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetTruckVan } from '../controllers/TruckVan/getTruckVanController.js';
import { CtrGetTruckVanId } from '../controllers/TruckVan/getTruckVanIdController.js';
import { CtrInsertTruckVan } from '../controllers/TruckVan/insertTruckVanController.js';
import { ValidateDataInsertMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware.js';
import { ValidateDataUpdateMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateUpdateChCaFu.middleware.js';
import { CtrUpdateTruckVan } from '../controllers/TruckVan/updateTruckVanController.js';
import { CtrDeleteTruckVan } from '../controllers/TruckVan/deleteTruckVanController.js';
import { Ctr_UdpStatusTruckVan } from '../controllers/TruckVan/updateStatusController.js';
import { Mdlware_ValidateFilesExt } from '../middlewares/validateFile.middleware.js';
import { Ctr_ActivateTruckVan } from '../controllers/TruckVan/activateTruckVanController.js';

const MODULE = 'Furgon';
const router = express.Router();

// Muestra los furgones
router.get('/see_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVan);
router.get('/see_truckvan_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVanId);

// Agrega un nuevo furgon
router.post('/add_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataInsertMiddleware, CtrInsertTruckVan);

// Actualiza la información de unfurgon
router.put('/update_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataUpdateMiddleware, CtrUpdateTruckVan);

// Actualiza el estado de un furgon
router.patch('/update_status_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusTruckVan);

// Activa/Desactiva un furgon
router.patch('/activate_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateTruckVan);

//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteTruckVan);

export default router;