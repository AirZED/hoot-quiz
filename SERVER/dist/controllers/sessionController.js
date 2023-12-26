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
const sessionModel_1 = __importDefault(require("../models/sessionModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const sendReponse_1 = __importDefault(require("../utils/sendReponse"));
class SessionController {
    constructor() {
        this.createSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { startTime, endTime } = req.body;
            const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!creatorId) {
                return next(new appError_1.default('Login to continue', 400));
            }
            const session = yield sessionModel_1.default.create({
                startTime,
                endTime,
                creatorId,
            });
            if (!session) {
                return next(new appError_1.default('Session creation otilored', 400));
            }
            (0, sendReponse_1.default)(res, 201, session);
        }));
        this.startSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            // find a session
            const session = yield sessionModel_1.default.findById(id);
            if (!session) {
                return next(new appError_1.default('Session does not exist', 404));
            }
            // check if session has already started
            if (session.active) {
                return next(new appError_1.default('Session is already active', 400));
            }
            session.active = true;
            yield session.save();
            // start the socket connection and allow people to join
            (0, sendReponse_1.default)(res, 201, session);
        }));
        this.getAllSessions = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
            const sessions = yield sessionModel_1.default.find({ creatorId: userId });
            if (!sessions) {
                return next(new appError_1.default('Session not found', 404));
            }
            (0, sendReponse_1.default)(res, 200, sessions);
        }));
        this.getSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            const sessionId = req.params.id;
            const session = yield sessionModel_1.default.findOne({
                _id: sessionId,
                creatorId: userId,
            });
            if (!session) {
                return next(new appError_1.default('Session not found', 404));
            }
            (0, sendReponse_1.default)(res, 200, session);
        }));
        this.updateSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
            const sessionId = req.params.id;
            const session = yield sessionModel_1.default.findOneAndUpdate({ _id: sessionId, creatorId: userId }, req.body, { returnDocument: 'after' });
            if (!session) {
                return next(new appError_1.default('Session not found', 404));
            }
            (0, sendReponse_1.default)(res, 201, session);
        }));
        this.deleteSession = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield sessionModel_1.default.findByIdAndDelete(req.params.id);
            (0, sendReponse_1.default)(res, 204, null);
        }));
    }
}
exports.default = new SessionController();
