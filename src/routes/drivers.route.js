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

const MODULE = 'Conductores';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetDrivers);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetDriverById);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataInsertDriver, Ctr_InsertDriver);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataUpdDriver, Ctr_UpdateDriver);
router.patch('/update_status', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_UpdateStatusDriver);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteDriver);

export default router;