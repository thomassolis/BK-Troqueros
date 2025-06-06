import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetServices } from '../controllers/services/getServicesController.js';
import { Ctr_GetServicesByID } from '../controllers/services/getServicesIdController.js';
import { Mdlware_ValidateDataInsertService } from '../middlewares/services/validateDataInsertServices.middleware.js';
import { Ctr_InsertServices } from '../controllers/services/insertServicesController.js';
import { Mdlware_ValidateDataUpdService } from '../middlewares/services/validateDataUpdate.middleware.js';
import { Ctr_UpdateServices } from '../controllers/services/updateServicesController.js';
import { Ctr_DeleteRutaService, Ctr_DeleteService } from '../controllers/services/deleteServicesController.js';
import { Ctr_InsertInfoService } from '../controllers/services/addInfoServicesController.js';
import { Mdlware_ValidateDataNewRuta } from '../middlewares/services/validateDataInsertRutaServices.middleware.js';
import { Mdlware_ValidateDataUpdRutService } from '../middlewares/services/validateDataUpdRuta.middleware.js';
import { Ctr_UpdRutaService } from '../controllers/services/updateRutaServicesController.js';
import { Ctr_ActivateService } from '../controllers/services/activateServicesController.js';

const MODULE = 'Servicios';
const router = express.Router();

router.get('/see_services', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetServices);
router.get('/see_services_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetServicesByID);

// Crea un nuevo servicio
router.post('/add_services', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataInsertService, Ctr_InsertServices);

// Crea un nueva ruta del servicio
router.post('/add_services/services_data', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataNewRuta, Ctr_InsertInfoService);

// Actualiza un servicio
router.put('/update_services', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataUpdService, Ctr_UpdateServices);

// Actualiza la ruta de un servicio
router.put('/update_services/services_data', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataUpdRutService, Ctr_UpdRutaService);

// Habilita/Deshabilita el servicio
router.patch('/activate_service/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateService);

// Habilita/Deshabilita la ruta del servicio
router.patch('/activate_service_data/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteService);

// Eliminación de un servicio de manera lógica
//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteService);

// Eliminación de una ruta de servicio lógico
//router.delete('/delete/services_data/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteRutaService);

export default router;