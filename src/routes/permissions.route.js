import express from 'express';
import { ValidatePermissionMiddleware } from '../middlewares/permissions.middleware.js';

const router = express.Router();

router.get('/clientes', ValidatePermissionMiddleware);
router.post('/clientes/add', ValidatePermissionMiddleware);
router.delete('/clientes/delete', ValidatePermissionMiddleware);
router.patch('/clientes/update', ValidatePermissionMiddleware);

export default router;