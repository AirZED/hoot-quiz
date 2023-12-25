import Session, { ISession } from '../models/sessionModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { RequestHandler } from 'express';
import { CustomRequest } from './authController';
import sendReponse from '../utils/sendReponse';

class SessionController {
  createSession: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      console.log('Hmmm');
      const { startTime, endTime } = req.body;
      const creatorId = req.user?.id;

      const session = await Session.create({
        startTime,
        endTime,
        creatorId,
      });

      console.log(session);

      if (!session) {
        return next(new AppError('Session creation otilored', 400));
      }

      sendReponse(res, 201, session);
    },
  );
  startSession: RequestHandler = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    // find a session
    const session: ISession | null = await Session.findById(id);

    if (!session) {
      return next(new AppError('Session does not exist', 404));
    }

    // check if session has already started

    if (session.active) {
      return next(new AppError('Session is already active', 400));
    }

    session.active = true;
    await session.save();
    // start the socket connection and allow people to join

    sendReponse(res, 201, session);
  });
  getAllSessions: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;

      const sessions = await Session.find({ creatorId: userId });
      if (!sessions) {
        return next(new AppError('Session not found', 404));
      }

      sendReponse(res, 200, sessions);
    },
  );
  getSession: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const sessionId = req.params.id;

      const session = await Session.findOne({
        _id: sessionId,
        creatorId: userId,
      });

      if (!session) {
        return next(new AppError('Session not found', 404));
      }

      sendReponse(res, 200, session);
    },
  );

  updateSession: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const sessionId = req.params.id;

      const session = await Session.findOneAndUpdate(
        { _id: sessionId, creatorId: userId },
        req.body,
        { returnDocument: 'after' },
      );

      if (!session) {
        return next(new AppError('Session not found', 404));
      }

      sendReponse(res, 201, session);
    },
  );

  deleteSession: RequestHandler = catchAsync(async (req, res, next) => {
    await Session.findByIdAndDelete(req.params.id);
    sendReponse(res, 204, null);
  });
}

export default new SessionController();
