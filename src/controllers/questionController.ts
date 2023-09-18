import { RequestHandler } from 'express';

import AppError from '../utils/appError';
import Question, { IQuestion } from '../models/questionModel';
import catchAsync from '../utils/catchAsync';
import { CustomRequest } from './authController';

class QuestionController {
  addQuestion: RequestHandler = catchAsync(
    async (req: CustomRequest, res, next) => {
      const { question, options, answer } = req.body;

      const creatorId = req.user?.id;

      const quiz: IQuestion = await Question.create({
        question,
        options,
        answer,
        creatorId,
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

  deleteQuestion: RequestHandler = catchAsync(async (req, res, next) => {});

  editQuestion: RequestHandler = catchAsync(async (req, res, next) => {});

  getAllQuestions: RequestHandler = catchAsync(async (req, res, next) => {
    const questions = await Question.find();

    if (!questions) {
      return next(new AppError('Questions not found', 404));
    }

    res.status(200).json({ status: 'success', questions });
  });

  getSingleQuestion: RequestHandler = catchAsync(async (req, res, next) => {});
}

export default new QuestionController();
