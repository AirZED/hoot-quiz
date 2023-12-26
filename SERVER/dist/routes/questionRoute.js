"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const questionController_1 = __importDefault(require("../controllers/questionController"));
const authController_1 = __importDefault(require("../controllers/authController"));
router.use(authController_1.default.protect, authController_1.default.restrictTo('user'));
router.get('/get_questions_by_session/:sessionId', questionController_1.default.getAllQuestionsBySession);
router.route('/').post(questionController_1.default.addQuestion);
router
    .route('/:id')
    .get(questionController_1.default.getSingleQuestion)
    .patch(questionController_1.default.editQuestion)
    .delete(questionController_1.default.deleteQuestion);
exports.default = router;
