import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';

class GameController {
  startGame: RequestHandler = catchAsync(async (req, res, next) => {
    // initialize the game
  });
  addGamePlayers: RequestHandler = catchAsync(async (req, res, next) => {
    // create temp_users adding them to the game
  });

  evaluateGame: RequestHandler = catchAsync(async (req, res, next) => {
    // manage a game round
  });
}

export default new GameController();
