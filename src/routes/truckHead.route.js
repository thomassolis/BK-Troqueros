import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetTruckHead } from '../controllers/TruckHead/getTruckHeadController.js';
import { ValidateDataInsertMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware.js';
import { ValidateDataUpdateMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateUpdateChCaFu.middleware.js';
import { CtrUpdateTruckHead } from '../controllers/TruckHead/updateTruckHeadController.js';
import { CtrGetTruckHeadId } from '../controllers/TruckHead/getTruckHeadIdController.js';
import { CtrInsertTruckHead } from '../controllers/TruckHead/insertTruckHeadController.js';
import { CtrDeleteTruckHead } from '../controllers/TruckHead/deleteTruckHeadController.js';
import { Ctr_UdpStatusTruckHead } from '../controllers/TruckHead/updateStatusController.js';

const MODULE = 'Cabezal';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckHead);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckHeadId);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataInsertMiddleware, CtrInsertTruckHead);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataUpdateMiddleware, CtrUpdateTruckHead);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusTruckHead);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteTruckHead);

export default router;