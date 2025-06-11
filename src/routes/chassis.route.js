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

// Muestra los chasis
router.get('/see_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassis);
router.get('/see_chassis_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetChassisId);

// Agrega un nuevo chasis
router.post('/add_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataInsertMiddleware, CtrInsertChassis);

// Actualiza la información de un chasis
router.put('/update_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataUpdateMiddleware, CtrUpdateChassis);

// Activa/Desactiva un chasis
router.patch('/active_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateChassis);

// Actualiza el estado del chasis
router.patch('/update_status_chassis', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusChassis);

//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteChassis);

export default router;