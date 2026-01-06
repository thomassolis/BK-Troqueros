import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { Ctr_GetAgenda } from '../controllers/getAgendaController.js';
import { Ctr_PostisEmptyDelivered } from '../controllers/Agend/isEmptyDeliveredController.js';
import { VerifyPermissionMiddleware } from '../middlewares/verifyPermission.middleware.js';

const router = express.Router();
const MODULE = 'Agenda';
// Obtiene la agenda
router.get('/get_agenda', ValidateTokenMiddleware, VerifyPermissionMiddleware(MODULE), Ctr_GetAgenda)

//Insert para saber si el contenedor vacío fue entregado o no
router.post('/isEmptyDelivered', ValidateTokenMiddleware, Ctr_PostisEmptyDelivered);
export default router;