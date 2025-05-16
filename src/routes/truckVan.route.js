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

const MODULE = 'Furgon';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVan);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckVanId);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataInsertMiddleware, CtrInsertTruckVan);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataUpdateMiddleware, CtrUpdateTruckVan);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusTruckVan);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteTruckVan);

export default router;