import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetClients } from '../controllers/clients/getClientsController.js';
import { Ctr_GetClientsById } from '../controllers/clients/getClientIDController.js';
import { Ctr_InsertClient } from '../controllers/clients/getInsertClientController.js';
import { MdlwareValidateDataInsertClient } from '../middlewares/clients/validateDataInsert.middleware.js';
import { Ctr_DeleteClient } from '../controllers/clients/deleteClientController.js';
import { Mdlware_ValidateDataUpdateClient } from '../middlewares/clients/validateDataUpdateClient.middleware.js';
import { Ctr_UpdateClient } from '../controllers/clients/updateClientController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetClients);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetClientsById);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_CREATE), VerifyPermissionMiddleware, MdlwareValidateDataInsertClient, Ctr_InsertClient);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_UPD), VerifyPermissionMiddleware, Mdlware_ValidateDataUpdateClient, Ctr_UpdateClient);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CL, process.env.PE_DEL), VerifyPermissionMiddleware, Ctr_DeleteClient);

export default router;