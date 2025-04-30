import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrInsertChassis } from '../controllers/chassis/insertChassisController.js';
import { CtrGetChassis } from '../controllers/chassis/getChassisController.js';
import { CtrUpdateChassis } from '../controllers/chassis/updateChassisController.js';
import { ValidateDataInsertMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware.js';
import { ValidateDataUpdateMiddleware } from '../middlewares/chassis_truckHead_truckVan/validateUpdateChCaFu.middleware.js';
import { CtrDeleteChassis } from '../controllers/chassis/deleteChassisController.js';
import { CtrGetChassisId } from '../controllers/chassis/getChassisIdController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetChassis);
router.get('/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetChassisId);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataInsertMiddleware, CtrInsertChassis);
router.put('/update', /*ValidateTokenMiddleware,*/ AddParamersMiddleware(process.env.TB_CH, process.env.PE_UPD), /*VerifyPermissionMiddleware,*/ ValidateDataUpdateMiddleware, CtrUpdateChassis);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_DEL), VerifyPermissionMiddleware, CtrDeleteChassis);

export default router;