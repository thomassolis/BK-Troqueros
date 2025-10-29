import express from 'express';
import { getGeneralReports } from '../controllers/Reports/getGeneralReports.js';

const router = express.Router();

router.get('/get_reports', getGeneralReports)

export default router;