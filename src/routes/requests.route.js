import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetRequests } from '../controllers/requests/getRequestsController.js';
import { Ctr_GetRequestsByID } from '../controllers/requests/getRequestsIDController.js';
import { Mdlware_ValidateDataInsertRequest } from '../middlewares/requests/validateDataInsertRequest.middleware.js';
import { Ctr_InsertRequest } from '../controllers/requests/insertRequestController.js';

const MODULE = 'Peticiones';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequests);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsByID);
router.post('/add', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Mdlware_ValidateDataInsertRequest, Ctr_InsertRequest);

export default router;