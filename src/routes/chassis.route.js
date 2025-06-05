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
import { Mdlware_ValidateFilesExt } from '../middlewares/validateFile.middleware.js';
import { Ctr_ActivateChassis } from '../controllers/chassis/activateChassisController.js';

const MODULE = 'Chasis';
const router = express.Router();

router.get('/see_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassis);
router.get('/see_chassis_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassisId);

router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataInsertMiddleware, CtrInsertChassis);

router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataUpdateMiddleware, CtrUpdateChassis);
router.patch('/active_chassis/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateChassis);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusChassis);

router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteChassis);

export default router;