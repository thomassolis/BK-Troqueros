import express from 'express';
import dotenv from 'dotenv';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { AddParamersMiddleware } from '../middlewares/addParamers.middleware.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';
import { CtrInsertChassis } from '../controllers/chassis/insertChassisController.js';
import { ValidateDataChassisMiddleware } from '../middlewares/insertChassis.middleware.js';
import { CtrGetChassis } from '../controllers/chassis/getChassisController.js';
import { ValidateUpdChassisDataMiddleware } from '../middlewares/validateupdChassis.middleware.js';
import { CtrUpdateChassis } from '../controllers/chassis/updateChassisController.js';

dotenv.config();

const router = express.Router();

router.get('/', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_SEE), VerifyPermissionMiddleware, CtrGetChassis);
router.post('/add', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_CREATE), VerifyPermissionMiddleware, ValidateDataChassisMiddleware, CtrInsertChassis);
router.put('/update', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_UPD), VerifyPermissionMiddleware, ValidateUpdChassisDataMiddleware, CtrUpdateChassis);
router.delete('/delete', ValidateTokenMiddleware, AddParamersMiddleware(process.env.TB_CH, process.env.PE_DEL), VerifyPermissionMiddleware);

export default router;