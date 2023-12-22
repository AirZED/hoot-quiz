import { Router } from 'express';

const router = Router();

// importing controller
import sessionController from '../controllers/sessionController';
import authController from '../controllers/authController';

// restrict to only signed in users
router.use(authController.protect, authController.restrictTo('user'));

router.route('/start/:id').post(sessionController.startSession);
router
  .route('/')
  .get(sessionController.getAllSessions)
  .post(sessionController.addSession);

router
  .route('/:id')
  .get(sessionController.getSession)
  .patch(sessionController.updateSession)
  .delete(sessionController.deleteSession);

export default router;
