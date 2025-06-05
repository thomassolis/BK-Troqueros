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

router.get('/see_truckvan', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVan);
router.get('/see_truckvan_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVanId);

router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataInsertMiddleware, CtrInsertTruckVan);

router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataUpdateMiddleware, CtrUpdateTruckVan);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusTruckVan);
router.patch('/activate_truckvan/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateTruckVan);

router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteTruckVan);

export default router;