"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const tempUserModel_1 = __importDefault(require("../models/tempUserModel"));
const sessionModel_1 = __importDefault(require("../models/sessionModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const sendReponse_1 = __importDefault(require("../utils/sendReponse"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
class GameController {
    constructor() {
        this.startGame = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // initialize the game
        }));
        this.addGamePlayers = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // create temp_users adding them to the game
            // enter session code and name
            const { sessionCode } = req.params;
            const { playerName } = req.body;
            const session = yield sessionModel_1.default.findOne({ code: sessionCode });
            if (!session) {
                return next(new appError_1.default('The session is not valid!', 404));
            }
            // increment number of players
            session.amountOfPlayers++;
            yield session.save({ validateBeforeSave: false });
            const tempUser = yield tempUserModel_1.default.create({
                name: playerName,
                session_id: session === null || session === void 0 ? void 0 : session.id,
            });
            (0, sendReponse_1.default)(res, 201, tempUser);
        }));
        this.submitGame = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { playerId: id } = req.params;
            const player = yield tempUserModel_1.default.findById(id);
            if (!player) {
                return next(new appError_1.default('Player not found', 404));
            }
            const score = yield this.calculateScore(req);
            console.log(score);
            player.score += score;
            yield player.save();
            console.log(player);
            (0, sendReponse_1.default)(res, 201, player, 'success');
        }));
        this.calculateScore = (req) => __awaiter(this, void 0, void 0, function* () {
            const maxScore = 100;
            const timeLimitInSeconds = 60;
            if (!(yield this.answerIsCorrect(req))) {
                return 0;
            }
            const timeDifferenceInSeconds = Date.now() / 1000;
            const timeScore = maxScore - (timeDifferenceInSeconds / timeLimitInSeconds) * maxScore;
            return Math.round(timeScore);
        });
        this.answerIsCorrect = (req) => __awaiter(this, void 0, void 0, function* () {
            const { answer, questionId, sessionId } = req.body;
            const question = yield questionModel_1.default.findOne({
                answer,
                _id: questionId,
                sessionId,
                answered: false,
            });
            if (!question) {
                return false;
            }
            return true;
        });
    }
}
exports.default = new GameController();
