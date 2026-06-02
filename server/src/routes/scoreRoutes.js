import express from 'express';
import { saveScore, getLeaderboard } from '../controllers/scoreController.js';

const router = express.Router();

router.post('/', saveScore);
router.get('/leaderboard', getLeaderboard);

export default router;
