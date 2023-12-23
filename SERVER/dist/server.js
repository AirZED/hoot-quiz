"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http"); // Change to use the http module
const socket_io_1 = require("socket.io");
dotenv_1.default.config({ path: './../.env' });
const db_1 = __importDefault(require("./db"));
const app_1 = __importDefault(require("./app"));
const httpServer = (0, http_1.createServer)(app_1.default); // Create an HTTP server
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
}); // Attach socket.io to the http server
const port = process.env.PORT || 3000;
(0, db_1.default)();
// test websocket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('sendMessage', (message) => {
        console.log('Received message:', message);
    });
});
httpServer.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});
