import express from 'express';
import { ValidatePathMiddleware } from '../middlewares/validatePath.middleware.js';
import { CtrPreviewFile } from '../controllers/downloadFileController.js';
const router = express.Router();

router.get('/:folder/:subfolderId/:subfolder/:fileName', ValidatePathMiddleware, CtrPreviewFile);

export default router;