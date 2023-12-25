"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// importing controller
const sessionController_1 = __importDefault(require("../controllers/sessionController"));
// restrict to only signed in users
// router.use(authController.protect, authController.restrictTo('user'));
router.route('/start/:id').post(sessionController_1.default.startSession);
router
    .route('/')
    .get(sessionController_1.default.getAllSessions)
    .post(sessionController_1.default.createSession);
router
    .route('/:id')
    .get(sessionController_1.default.getSession)
    .patch(sessionController_1.default.updateSession)
    .delete(sessionController_1.default.deleteSession);
exports.default = router;
