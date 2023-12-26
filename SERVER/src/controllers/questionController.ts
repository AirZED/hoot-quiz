import { RequestHandler } from 'express';

import AppError from '../utils/appError';
import Question, { IQuestion } from '../models/questionModel';
import catchAsync from '../utils/catchAsync';
import { CustomRequest } from './authController';

class QuestionController {
  addQuestion: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { question, options, answer, sessionId } = req.body;
      
      const creatorId = req.user?.id;

      const quiz: IQuestion = await Question.create({
        question,
        options,
        answer,
        creatorId,
        sessionId,
      });
      if (!quiz) {
        return next(new AppError('There was an error creating question', 400));
      }

      res.status(201).json({
        status: 'success',
        quiz,
      });
    },
  );

  deleteQuestion: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const questionId = req.params.id;

      const question = await Question.findOneAndDelete({
        creatorId: userId,
        _id: questionId,
      });

      res.status(204).json({ status: 'success', question: null });
    },
  );

  editQuestion: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const questionId = req.params.id;

      const question = await Question.findOneAndUpdate(
        {
          creatorId: userId,
          _id: questionId,
        },
        req.body,
        { returnDocument: 'after' },
      );

      if (!question) {
        return next(new AppError('Question update was not successful', 400));
      }

      res.status(201).json({ status: 'success', question });
    },
  );

  getAllQuestionsBySession: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      //You need both user id and session id to get questions
      const userId = req.user?.id;
      const { sessionId } = req.params;

      console.log(sessionId);
      const questions = await Question.find({ creatorId: userId, sessionId });

      if (!questions) {
        return next(new AppError('Questions not found', 404));
      }
      res.status(200).json({ status: 'success', questions });
    },
  );

  getSingleQuestion: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const userId = req.user?.id;
      const questionId = req.params.id;

      const question = await Question.findOne({
        creatorId: userId,
        _id: questionId,
      });

      if (!question) {
        return next(new AppError('Question not found', 404));
      }

      res.status(201).json({
        status: 'success',
        question,
      });
    },
  );
}

export default new QuestionController();
