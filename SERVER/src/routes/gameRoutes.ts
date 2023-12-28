import { Router } from 'express';
import gameController from '../controllers/gameController';
import authController from '../controllers/authController';

const router = Router();

// importing authController
router.route('/:sessionCode').get(gameController.addGamePlayers);

// add a protect middleware for this routes
router.use(authController.protect);

router.post('/start/:sessionId', gameController.startGame);
router.post('/evaluate/:sessionId', gameController.submitGame);
export default router;
