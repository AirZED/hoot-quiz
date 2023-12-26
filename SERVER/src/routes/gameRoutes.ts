import { Router } from 'express';
import gameController from '../controllers/gameController';

const router = Router();

// importing authController
router.route('/:sessionCode').get(gameController.addGamePlayers);

export default router;
