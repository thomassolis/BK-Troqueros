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
import { Mdlware_ValidateFilesExt } from '../middlewares/validateFile.middleware.js';
import { Ctr_ActivateTruckhead } from '../controllers/TruckHead/activateTruckHeadController.js';

const MODULE = 'Cabezal';
const router = express.Router();

// Muestra los cabezales
router.get('/see_truckhead', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckHead);
router.get('/see_truckhead_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrGetTruckHeadId);

// Agrega un nuevo cabezal
router.post('/add_truckhead', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataInsertMiddleware, CtrInsertTruckHead);

// Actualiza la información de un cabezal
router.put('/update_truckhead', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, ValidateDataUpdateMiddleware, CtrUpdateTruckHead);

// Actualiza el estado del cabezal
router.patch('/update_status_truckhead', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UdpStatusTruckHead);

// Habilita/Deshabilita un cabezal
router.patch('/activate_truckhead', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateTruckhead);

//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), CtrDeleteTruckHead);

export default router;