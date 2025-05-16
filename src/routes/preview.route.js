import express from 'express';
import { ValidatePathMiddleware } from '../middlewares/validatePath.middleware.js';
import { Ctr_PreviewFile } from '../controllers/previewFileController.js';

const router = express.Router();

router.get('/:folder/:subfolderId/:subfolder/:fileName', ValidatePathMiddleware, Ctr_PreviewFile);

export default router;