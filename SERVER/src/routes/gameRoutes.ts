import { Router } from 'express';
import gameController from '../controllers/gameController';
import authController from '../controllers/authController';

const router = Router();

// importing authController
router.route('/:sessionCode').get(gameController.addGamePlayers);
router.post('/submit/:playerId', gameController.submitGame);

// add a protect middleware for this routes
router.use(authController.protect);
router.post('/start/:sessionId', gameController.startGame);
export default router;
