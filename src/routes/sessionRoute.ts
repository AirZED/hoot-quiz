import { Router } from 'express';

const router = Router();

// importing controller
import sessionController from '../controllers/sessionController';
import authController from '../controllers/authController';

// restrict to only signed in users
router.use(authController.protect, authController.restrictTo('user'));
router.post('/', sessionController.addSession);

export default router;
