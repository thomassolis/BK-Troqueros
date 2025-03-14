import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetTruckHead } from '../controllers/TruckHead/getTruckHeadController.js';
import { ValidateDataInsertMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware.js';
import { ValidateDataUpdateMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateUpdateChCaFu.middleware.js';
import { CtrUpdateTruckHead } from '../controllers/TruckHead/updateTruckHeadController.js';
import { CtrGetTruckHeadId } from '../controllers/TruckHead/getTruckHeadIdController.js';
import { CtrInsertTruckHead } from '../controllers/TruckHead/insertTruckHeadController.js';
import { CtrDeleteTruckHead } from '../controllers/TruckHead/deleteTruckHeadController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckHead);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckHeadId);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataInsertMiddleware, CtrInsertTruckHead);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateDataUpdateMiddleware, CtrUpdateTruckHead);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CA, process.env.PE_DEL), VerifyPermissionMiddleware, CtrDeleteTruckHead);

export default router;