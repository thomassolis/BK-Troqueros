import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrGetTruckVan } from '../controllers/TruckVan/getTruckVanController.js';
import { CtrGetTruckVanId } from '../controllers/TruckVan/getTruckVanIdController.js';
import { ValidateDataTruckVanMiddleware } from '../middlewares/TruckVan/insertTruckVan.middleware.js';
import { CtrInsertTruckVan } from '../controllers/TruckVan/insertTruckVanController.js';
import { ValidateUpdTruckVanDataMiddleware } from '../middlewares/TruckVan/validateUpdTruckVan.middleware.js';
import { CtrUpdateTruckVan } from '../controllers/TruckVan/updateTruckVanController.js';
import { CtrDeleteTruckVan } from '../controllers/TruckVan/deleteTruckVanController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_FU, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckVan);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_FU, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetTruckVanId);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_FU, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataTruckVanMiddleware, CtrInsertTruckVan);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_FU, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateUpdTruckVanDataMiddleware, CtrUpdateTruckVan);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_FU, process.env.PE_DEL), VerifyPermissionMiddleware, CtrDeleteTruckVan);

export default router;