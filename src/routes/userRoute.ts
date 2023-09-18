import { Router } from 'express';

const router = Router();

import authController from '../controllers/authController';

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.patch('/forgetPassword', authController.forgetPassword);

router.patch('/resetPassword/:resetToken', authController.resetPassword)

export default router;
