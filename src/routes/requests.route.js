import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetRequests } from '../controllers/requests/getRequestsController.js';
import { Ctr_GetRequestsByID } from '../controllers/requests/getRequestsIDController.js';

const MODULE = 'Peticiones';
const router = express.Router();

router.get('/', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequests);
router.get('/:id', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetRequestsByID);

export default router;