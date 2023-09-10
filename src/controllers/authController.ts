import { RequestHandler } from 'express';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

class AuthController {
  signup: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const user: IUser = await User.create(req.body);

    if (!user) {
      return next(
        new AppError('Sign-up not successfull, an error occured', 400),
      );
    }

    res.status(201).json({
      message: 'success',
      user: user,
    });
  });

  login: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    res.send('House');
  });

  protect: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      res.send('some food');
    },
  );

  restrictTo: RequestHandler = (...roles) =>
    catchAsync(async (req, res, next): Promise<void> => {
      // Check user type and allow certain previledges
      res.send('I live alone');
    });
}

export default AuthController;
