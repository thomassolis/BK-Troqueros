import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetClients } from '../controllers/clients/getClientsController.js';
import { Ctr_GetClientsById } from '../controllers/clients/getClientIDController.js';
import { Ctr_InsertClient } from '../controllers/clients/insertClientController.js';
import { MdlwareValidateDataInsertClient } from '../middlewares/clients/validateDataInsert.middleware.js';
import { Ctr_DeleteClient } from '../controllers/clients/deleteClientController.js';
import { Mdlware_ValidateDataUpdateClient } from '../middlewares/clients/validateDataUpdateClient.middleware.js';
import { Ctr_UpdateClient } from '../controllers/clients/updateClientController.js';
import { Mdlware_ValidateFilesExt } from '../middlewares/validateFile.middleware.js';
import { Ctr_ActivateClient } from '../controllers/clients/activateClientController.js';

const MODULE = 'Clientes';
const router = express.Router();

// Muestra los clientes
router.get('/see_clients', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetClients);
router.get('/see_clients_id/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetClientsById);

// Agrega un nuevo cliente
router.post('/add_client', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, MdlwareValidateDataInsertClient, Ctr_InsertClient);

// Actualiza la información de un cliente
router.put('/update_client', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataUpdateClient, Ctr_UpdateClient);

// Habilita/Deshabilita un cliente
router.patch('/activate_client', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_ActivateClient);
//router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteClient);

export default router;