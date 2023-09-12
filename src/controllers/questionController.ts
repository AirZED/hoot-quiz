import { RequestHandler } from 'express';

import AppError from '../utils/appError';
import Question from '../models/questionModel';
import catchAsync from '../utils/catchAsync';

class QuestionController {
  addQuestion: RequestHandler = catchAsync(async (req, res, next) => {
    const { question, options, answer } = req.body;

    const quiz = await Question.create({ question, options, answer });
    if (!quiz) {
      return next(new AppError('There was an error creating question', 400));
    }

    res.status(201).json({
      status: 'success',
      quiz,
    });
  });

  deleteQuestion: RequestHandler = catchAsync(async (req, res, next) => {});

  editQuestion: RequestHandler = catchAsync(async (req, res, next) => {});

  getAllQuestions: RequestHandler = catchAsync(async (req, res, next) => {});

  getSingleQuestion: RequestHandler = catchAsync(async (req, res, next) => {});
}

export default new QuestionController();
