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

const MODULE = 'Clientes';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetClients);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetClientsById);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, MdlwareValidateDataInsertClient, Ctr_InsertClient);
router.put('/update', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateFilesExt, Mdlware_ValidateDataUpdateClient, Ctr_UpdateClient);
router.delete('/delete/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_DeleteClient);

export default router;