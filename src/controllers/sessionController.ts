import Session, { ISession } from '../models/sessionModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { RequestHandler } from 'express';

class SessionController {
  addSession: RequestHandler = catchAsync(async (req, res, next) => {
    const { startTime, endTime, creatorId } = req.body;

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
  });
}

export default new SessionController();
