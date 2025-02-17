import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetTruckHead } from '../controllers/TruckHead/getTruckHeadController.js';
import { ValidateUpdTruckHeadDataMiddleware } from '../middlewares/TruckHead/validateUpdTruckHead.middleware.js';
import { CtrUpdateTruckHead } from '../controllers/TruckHead/updateTruckHeadController.js';
import { CtrGetTruckHeadId } from '../controllers/TruckHead/getTruckHeadIdController.js';
import { CtrInsertTruckHead } from '../controllers/TruckHead/insertTruckHeadController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckHead);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckHeadId);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_CREATE), VerifyPermissionMiddleware, CtrInsertTruckHead);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateUpdTruckHeadDataMiddleware, CtrUpdateTruckHead);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_DEL), VerifyPermissionMiddleware);

export default router;