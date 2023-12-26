import { Router } from 'express';

const router = Router();

import questionController from '../controllers/questionController';
import authController from '../controllers/authController';

router.use(authController.protect, authController.restrictTo('user'));

router.get(
  '/get_questions_by_session/:sessionId',
  questionController.getAllQuestionsBySession,
);

router.route('/').post(questionController.addQuestion);

router
  .route('/:id')
  .get(questionController.getSingleQuestion)
  .patch(questionController.editQuestion)
  .delete(questionController.deleteQuestion);

export default router;
