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
            const tempUser = yield tempUserModel_1.default.create({
                name: playerName,
                session_id: session === null || session === void 0 ? void 0 : session.id,
            });
        }));
        this.evaluateGame = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // manage a game round
        }));
    }
}
exports.default = new GameController();
