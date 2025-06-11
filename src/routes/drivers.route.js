import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetDrivers } from '../controllers/drivers/getDriversController.js';
import { Ctr_GetDriverById } from '../controllers/drivers/getDriversIdController.js';
import { Mdlware_ValidateDataInsertDriver } from '../middlewares/drivers/validateDataInsertDriver.middleware.js';
import { Ctr_InsertDriver } from '../controllers/drivers/insertDriverController.js';
import { Mdlware_ValidateDataUpdDriver } from '../middlewares/drivers/validateDataUpdateDriver.middleware.js';
import { Ctr_UpdateDriver } from '../controllers/drivers/updateDriverController.js';
import { Ctr_UpdateStatusDriver } from '../controllers/drivers/updateStatusDriverController.js';
import { Ctr_DeleteDriver } from '../controllers/drivers/deleteDriverController.js';
import { Mdlware_ValidateFilesExt } from '../middlewares/validateFile.middleware.js';
import { Ctr_ActivateDriver } from '../controllers/drivers/activateDriverController.js';

const MODULE = 'Conductores';
const router = express.Router();

// Muestra los conductores
router.get('/see_drivers', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetDrivers);
router.get('/see_driver_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetDriverById);

// Agrega un nuevo conductor
router.post('/add_driver', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataInsertDriver, Ctr_InsertDriver);

// Actualiza la información de un conductor
router.put('/update_driver', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataUpdDriver, Ctr_UpdateDriver);

// Actualiza el estado de un conductor
router.patch('/update_status_driver', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UpdateStatusDriver);

// Habilita/Deshabilita un conductor
router.patch('/activate_driver', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateDriver);
//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), VerifyPermissionMiddleware, Ctr_DeleteDriver);

export default router;