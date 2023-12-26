import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import TempUser from '../models/tempUserModel';
import Session, { ISession } from '../models/sessionModel';
import AppError from '../utils/appError';

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

    const tempUser = await TempUser.create({
      name: playerName,
      session_id: session?.id,
    });
  });

  evaluateGame: RequestHandler = catchAsync(async (req, res, next) => {
    // manage a game round
  });
}

export default new GameController();
