import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetServices } from '../controllers/services/getServicesController.js';
import { Ctr_GetServicesByID } from '../controllers/services/getServicesIdController.js';
import { Mdlware_ValidateDataInsertService } from '../middlewares/services/validateDataInsertServices.middleware.js';
import { Ctr_InsertServices } from '../controllers/services/insertServicesController.js';
import { Mdlware_ValidateDataUpdService } from '../middlewares/services/validateDataUpdate.middleware.js';
import { Ctr_UpdateServices } from '../controllers/services/updateServicesController.js';

const MODULE = 'Servicios';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetServices);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetServicesByID);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataInsertService, Ctr_InsertServices);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataUpdService, Ctr_UpdateServices);

export default router;