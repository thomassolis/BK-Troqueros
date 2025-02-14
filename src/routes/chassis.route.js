import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrInsertChassis } from '../controllers/chassis/insertChassisController.js';
import { CtrGetChassis } from '../controllers/chassis/getChassisController.js';
import { CtrUpdateChassis } from '../controllers/chassis/updateChassisController.js';
import { ValidateDataChassisMiddleware } from '../middlewares/chassis/insertChassis.middleware.js';
import { ValidateUpdChassisDataMiddleware } from '../middlewares/chassis/validateUpdChassis.middleware.js';
import { CtrDeleteChassis } from '../controllers/chassis/deleteChassisController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetChassis);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataChassisMiddleware, CtrInsertChassis);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateUpdChassisDataMiddleware, CtrUpdateChassis);
router.delete('/delete/:id', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_DEL), VerifyPermissionMiddleware, CtrDeleteChassis);

export default router;