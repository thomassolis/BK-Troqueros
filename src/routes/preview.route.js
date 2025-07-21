import express from 'express';
import { ValidatePathMiddleware } from '../middlewares/validatePath.middleware.js';
import { Ctr_PreviewFile } from '../controllers/previewFileController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:folder/:subfolderId/:subfolder/:fileName', ValidateTokenMiddleware, ValidatePathMiddleware, Ctr_PreviewFile);

export default router;