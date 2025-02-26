import express from 'express';
import { ValidatePathMiddleware } from '../middlewares/validatePath.middleware.js';
import { CtrDownloadFile } from '../controllers/downloadFileController.js';

const router = express.Router();

router.get('/:folder/:subfolderId/:subfolder/:fileName', ValidatePathMiddleware, CtrDownloadFile);

export default router;