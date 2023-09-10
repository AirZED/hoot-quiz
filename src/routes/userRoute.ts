import { Router } from 'express';

const router = Router();

import AuthController from '../controllers/authController';
const authController = new AuthController();

router.post('/signup', authController.signup);

export default router;
