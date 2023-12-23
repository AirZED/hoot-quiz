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
const appError_1 = __importDefault(require("../utils/appError"));
const questionModel_1 = __importDefault(require("../models/questionModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class QuestionController {
    constructor() {
        this.addQuestion = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { question, options, answer, sessionId } = req.body;
            const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const quiz = yield questionModel_1.default.create({
                question,
                options,
                answer,
                creatorId,
                sessionId,
            });
            if (!quiz) {
                return next(new appError_1.default('There was an error creating question', 400));
            }
            res.status(201).json({
                status: 'success',
                quiz,
            });
        }));
        this.deleteQuestion = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
            const questionId = req.params.id;
            const question = yield questionModel_1.default.findOneAndDelete({
                creatorId: userId,
                _id: questionId,
            });
            res.status(204).json({ status: 'success', question: null });
        }));
        this.editQuestion = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            const questionId = req.params.id;
            const question = yield questionModel_1.default.findOneAndUpdate({
                creatorId: userId,
                _id: questionId,
            }, req.body, { returnDocument: 'after' });
            if (!question) {
                return next(new appError_1.default('Question update was not successful', 400));
            }
            res.status(201).json({ status: 'success', question });
        }));
        this.getAllQuestions = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
            const questions = yield questionModel_1.default.find({ creatorId: userId });
            if (!questions) {
                return next(new appError_1.default('Questions not found', 404));
            }
            res.status(200).json({ status: 'success', questions });
        }));
        this.getSingleQuestion = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
            const questionId = req.params.id;
            const question = yield questionModel_1.default.findOne({
                creatorId: userId,
                _id: questionId,
            });
            if (!question) {
                return next(new appError_1.default('Question not found', 404));
            }
            res.status(201).json({
                status: 'success',
                question,
            });
        }));
    }
}
exports.default = new QuestionController();
