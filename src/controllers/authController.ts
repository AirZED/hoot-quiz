import { RequestHandler } from 'express';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import jwt from 'jsonwebtoken';

interface verifyType {
  token: string;
  secretOrPublicKey: string;
}
class AuthController {
  signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  signup: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const { name, email, password, passwordConfirm, role } = req.body;
    const user: IUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    if (!user) {
      return next(
        new AppError('Sign-up not successfull, an error occured', 400),
      );
    }

    res.status(201).json({
      message: 'success',
    });
  });

  login: RequestHandler = catchAsync(async (req, res, next): Promise<void> => {
    const { email, password } = req.body;

    //check if email and password is valid
    if (!email || !password) {
      return next(new AppError('Please provide a password and an email', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user!.comparePassword(password))) {
      return next(new AppError('User email or password is invalid', 404));
    }

    const token = this.signToken(user.id);

    res.status(201).json({
      message: 'success',
      token,
      user,
    });
  });

  protect: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      // check the headers bearer token
      let token: string | undefined;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[0];
      }

      if (!token) {
        return next(new AppError('Provide token in header', 404));
      }
      const decoded = await jwt.verify(token, process.env.JWT_SECRET || '');

      console.log(decoded);

      // console.log(decoded.iat);

      // confirm is the user is still valid
      // confirm if user changed password between this time
      next();
    },
  );

  restrictTo: RequestHandler = (...roles) =>
    catchAsync(async (req, res, next): Promise<void> => {
      // Check user type and allow certain previledges
      res.send('I live alone');
    });
}

export default new AuthController();
