import Session from '../models/sessionModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { RequestHandler } from 'express';
import { CustomRequest } from './authController';

class SessionController {
  addSession: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { startTime, endTime } = req.body;
      const creatorId = req.user?.id;

      const session = await Session.create({
        startTime,
        endTime,
        creatorId,
      });

      if (!session) {
        return next(new AppError('Session creation otilored', 400));
      }

      res.status(201).json({
        status: 'success',
        session,
      });
    },
  );
}

export default new SessionController();
