import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetDrivers } from '../controllers/drivers/getDriversController.js';
import { Ctr_GetDriverById } from '../controllers/drivers/getDriversIdController.js';
import { Mdlware_ValidateDataInsertDriver } from '../middlewares/drivers/validateDataInsertDriver.middleware.js';
import { Ctr_InsertDriver } from '../controllers/drivers/insertDriverController.js';
import { Mdlware_ValidateDataUpdDriver } from '../middlewares/drivers/validateDataUpdateDriver.middleware.js';
import { Ctr_UpdateDriver } from '../controllers/drivers/updateDriverController.js';
import { Ctr_UpdateStatusDriver } from '../controllers/drivers/updateStatusDriverController.js';
import { Ctr_DeleteDriver } from '../controllers/drivers/deleteDriverController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetDrivers);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetDriverById);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_CREATE), VerifyPermissionMiddleware, Mdlware_ValidateDataInsertDriver, Ctr_InsertDriver);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_UPD), VerifyPermissionMiddleware, Mdlware_ValidateDataUpdDriver, Ctr_UpdateDriver);
router.patch('/update_status', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_UPD), VerifyPermissionMiddleware, Ctr_UpdateStatusDriver);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_UPD), VerifyPermissionMiddleware, Ctr_DeleteDriver);

export default router;