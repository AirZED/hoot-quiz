import { RequestHandler } from 'express';
import User, { IUser } from '../models/userModel';

class AuthController {
  signup: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const user: IUser = await User.create(req.body);

      if (!user) {
        throw new Error('User not created, an error occured');
      }

      res.status(201).json({
        message: 'success',
        user: user,
      });
    } catch (error) {
      res.status(500).json({
        message: 'not successful',
        status: 'failed',
      });
    }
  };
}

export default AuthController;
