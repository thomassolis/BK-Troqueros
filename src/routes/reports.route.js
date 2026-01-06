import express from 'express';
import { getGeneralReports } from '../controllers/Reports/getGeneralReports.js';
import { getTeamReports } from '../controllers/Reports/getGeneralReports.js';

const router = express.Router();

router.get('/get_reports', getGeneralReports)

router.get('/get_team_reports', getTeamReports)


export default router;