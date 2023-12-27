import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import TempUser from '../models/tempUserModel';
import Session from '../models/sessionModel';
import AppError from '../utils/appError';
import sendReponse from '../utils/sendReponse';

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
    console.log(session);
    await session.save({ validateBeforeSave: false });

    const tempUser = await TempUser.create({
      name: playerName,
      session_id: session?.id,
    });

    sendReponse(res, 201, tempUser);
  });

  evaluateGame: RequestHandler = catchAsync(async (req, res, next) => {
    // manage a game round
  });
}

export default new GameController();
