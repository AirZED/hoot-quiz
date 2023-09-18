import { RequestHandler, Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../utils/email';
import crypto from 'crypto';

export interface CustomRequest extends Request {
  user?: IUser;
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

  forgetPassword: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      // forget password
      const { email } = req.body;

      // find account to confirm availability
      const user = await User.findOne({ email });

      if (!user) {
        return next(new AppError('Please, input valid email', 400));
      }

      const resetToken = user.sendPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/user/resetPassword/${resetToken}`;

      const message = `Forget your password, Visit this link to reset your password : ${resetUrl} \nIf you didnt forget your password, ignore this email`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Reset Password',
          message,
        });

        res.status(201).json({
          status: 'success',
          message: 'Password reset token sent successfully',
        });
      } catch (err) {
        res
          .status(400)
          .json({ message: 'There was an error, try again', status: 'error' });
      }
    },
  );

  resetPassword: RequestHandler = catchAsync(
    async (req, res, next): Promise<void> => {
      // confirm the reset Token

      const { password, passwordConfirm } = req.body;

      const { resetToken } = req.params;

      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await User.findOne({ passwordResetToken });

      if (!user || !user.checkResetTokenExpiration()) {
        return next(new AppError('Invalid or expired reset Token', 400));
      }

      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpireTime = undefined;
      await user.save();

      res.status(201).json({
        message: 'success',
      });
    },
  );

  protect: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next): Promise<void> => {
      // check the headers bearer token
      let token: string | undefined;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(new AppError('auth token not available in header', 404));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || '',
      ) as JwtPayload;

      const user = await User.findOne({ _id: decoded.id });

      if (!user) {
        return next(new AppError('The user does not exist', 400));
      }

      const isChangePassword = user.checkPasswordChange(decoded.iat as number);

      console.log(isChangePassword);

      if (isChangePassword) {
        return next(
          new AppError(
            'This user is a fraud, password was changed amidst request',
            400,
          ),
        );
      }

      req.user = user;
      next();
    },
  );

  restrictTo = (...roles: string[]): RequestHandler =>
    catchAsync(async (req: CustomRequest, res, next): Promise<void> => {
      if (!roles.includes(req.user?.role as string)) {
        res.status(402).json({
          message: 'Does not have permission to access resource',
          status: 'failed',
        });
      }

      next();
    });
}

export default new AuthController();
