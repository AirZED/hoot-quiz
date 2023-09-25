import Session from '../models/sessionModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { RequestHandler } from 'express';
import { CustomRequest } from './authController';

class SessionController {
  getAllSessions: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;

      const sessions = await Session.find({ creatorId: userId });
      if (!sessions) {
        return next(new AppError('Session not found', 404));
      }

      res.status(200).json({ status: 'success', sessions });
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

      res.status(200).json({ status: 'success', session });
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

      res.status(201).json({
        status: 'success',
        session,
      });
    },
  );
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

  deleteSession: RequestHandler = catchAsync(async (req, res, next) => {
    await Session.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}

export default new SessionController();
