import { RequestHandler, Request } from 'express';
import catchAsync from '../utils/catchAsync';
import TempUser from '../models/tempUserModel';
import Session from '../models/sessionModel';
import AppError from '../utils/appError';
import sendReponse from '../utils/sendReponse';
import Question from '../models/questionModel';

class GameController {
  startGame: RequestHandler = catchAsync(async (req, res, next) => {
    // initialize the game
  });
  addGamePlayers: RequestHandler = catchAsync(async (req, res, next) => {
    // create temp_users adding them to the game
    // enter session code and name
    const { sessionCode } = req.params;
    const { playerName } = req.body;

    const session = await Session.findOne({ code: sessionCode });

    if (!session) {
      return next(new AppError('The session is not valid!', 404));
    }

    // increment number of players
    session.amountOfPlayers++;
    await session.save({ validateBeforeSave: false });

    const tempUser = await TempUser.create({
      name: playerName,
      session_id: session?.id,
    });

    sendReponse(res, 201, tempUser);
  });

  submitGame: RequestHandler = catchAsync(async (req, res, next) => {
    const { playerId: id } = req.params;
    const player = await TempUser.findById(id);
  });

  private calculateScore = async (req: Request) => {
    const maxScore = 100;
    const timeLimitInSeconds = 60;

    if (await this.answerIsCorrect(req)) {
      const timeDifferenceInSeconds = Date.now() / 1000;

      const timeScore = Math.max(
        0,
        maxScore - (timeDifferenceInSeconds / timeLimitInSeconds) * maxScore,
      );

      return Math.round(timeScore);
    } else {
      return 0; // If the answer is incorrect, assign a score of 0
    }
  };

  private answerIsCorrect = async (req: Request): Promise<boolean> => {
    // sessionId, playerId, questionId, answer
    const { answer, playerId, questionId, sessionId } = req.body;

    const question = await Question.findOne({
      answer,
      id: questionId,
      sessionId,
      answered: false,
    });
    if (!question) {
      return false;
    }
    return true;
  };
}

export default new GameController();
