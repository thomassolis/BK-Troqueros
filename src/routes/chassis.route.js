import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrInsertChassis } from '../controllers/chassis/insertChassisController.js';
import { CtrGetChassis } from '../controllers/chassis/getChassisController.js';
import { CtrUpdateChassis } from '../controllers/chassis/updateChassisController.js';
import { ValidateDataInsertMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware.js';
import { ValidateDataUpdateMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateUpdateChCaFu.middleware.js';
import { CtrDeleteChassis } from '../controllers/chassis/deleteChassisController.js';
import { CtrGetChassisId } from '../controllers/chassis/getChassisIdController.js';
import { Ctr_UdpStatusChassis } from '../controllers/chassis/updateStatusController.js';

const MODULE = 'Chasis';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassis);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassisId);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataInsertMiddleware, CtrInsertChassis);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), ValidateDataUpdateMiddleware, CtrUpdateChassis);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusChassis);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteChassis);

export default router;