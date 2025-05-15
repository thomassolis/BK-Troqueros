import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { Ctr_GetDrivers } from '../controllers/drivers/getDriversController.js';
import { Ctr_GetDriverById } from '../controllers/drivers/getDriversIdController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetDrivers)
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CO, process.env.PE_SEE), VerifyPermissionMiddleware, Ctr_GetDriverById)

export default router;