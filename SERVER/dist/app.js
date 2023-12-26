"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// log morgan
// if (process.env.NODE_ENV === 'development') {
app.use((0, morgan_1.default)('dev'));
// }
// parse the body
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10kb' }));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const questionRoute_1 = __importDefault(require("./routes/questionRoute"));
const sessionRoute_1 = __importDefault(require("./routes/sessionRoute"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
app.use('/api/v1/user', userRoute_1.default);
app.use('/api/v1/question', questionRoute_1.default);
app.use('/api/v1/session', sessionRoute_1.default);
app.use('/api/v1/game', gameRoutes_1.default);
app.get('/', (req, res) => {
    res.send('api is running on live port');
});
app.all('*', (req, res, next) => {
    const message = `${req.originalUrl} route cannot be found on this server`;
    return next(new appError_1.default(message, 404));
});
app.use(errorController_1.default.globalSendError);
exports.default = app;
