import { Router } from 'express';

const router = Router();

import questionController from '../controllers/questionController';
import authController from '../controllers/authController';

router.use(authController.protect);
router
  .route('/')
  .get(questionController.getAllQuestions)
  .post(authController.restrictTo('user'), questionController.addQuestion);

router
  .route('/:id')
  .get(questionController.getSingleQuestion)
  .patch(questionController.editQuestion)
  .delete(questionController.deleteQuestion);

export default router;
