import express from 'express';
import { ValidatePathMiddleware } from '../middlewares/validatePath.middleware.js';
//import { CtrDownloadFile } from '../controllers/downloadFileController.js';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { Ctr_DownloadFileRequest } from '../controllers/requests/downloadFileRequestController.js';

const router = express.Router();

// Descargar archivos (cédula, licencia, etc)
//router.get('/:folder/:subfolderId/:subfolder/:fileName', ValidateTokenMiddleware, ValidatePathMiddleware, CtrDownloadFile);

// Descargar archivo Excel peticiones
router.get('/download_request', ValidateTokenMiddleware, Ctr_DownloadFileRequest);

export default router;