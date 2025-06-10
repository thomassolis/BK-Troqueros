import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetRequests } from '../controllers/requests/getRequestsController.js';
import { Ctr_GetRequestsByID } from '../controllers/requests/getRequestsIDController.js';
import { Mdlware_ValidateDataInsertRequest } from '../middlewares/requests/validateDataInsertRequest.middleware.js';
import { Ctr_InsertRequest } from '../controllers/requests/insertRequestController.js';
import { Ctr_GetRequestsServices } from '../controllers/requests/getRequestsServicesController.js';
import { Ctr_GetRequestsDataServices } from '../controllers/requests/getRequestDataServiceController.js';
import { Ctr_GetRequestsDrivers } from '../controllers/requests/getRequestDriverController.js';

const MODULE = 'Peticiones';
const router = express.Router();

// Datos para el el select
//Muestra los servicios
router.get('/get_request_services', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsServices);

// Muestra las rutas de los servicios
router.get('/get_request_data_services/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsDataServices);

// Muestra los conductores
router.get('/get_request_drivers', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsDrivers);

// Muestra las peticiones
router.get('/see_requests', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequests);
router.get('/see_request_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsByID);

// Agrega una nueva petición
router.post('/add_request', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataInsertRequest, Ctr_InsertRequest);

//
export default router;