import express from 'express';
import { ValidateTokenMiddleware } from '../middlewares/auth.middleware.js';
import { Ctr_GetAgenda } from '../controllers/getAgendaController.js';

const router = express.Router();

// Obtiene la agenda
router.get('/get_agenda', ValidateTokenMiddleware, Ctr_GetAgenda)

export default router;