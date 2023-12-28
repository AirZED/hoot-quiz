"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = __importDefault(require("../controllers/gameController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const router = (0, express_1.Router)();
// importing authController
router.route('/:sessionCode').get(gameController_1.default.addGamePlayers);
router.post('/submit/:playerId', gameController_1.default.submitGame);
// add a protect middleware for this routes
router.use(authController_1.default.protect);
router.post('/start/:sessionId', gameController_1.default.startGame);
exports.default = router;
