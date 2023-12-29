"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const http_1 = require("http"); // Change to use the http module
const ws_1 = __importDefault(require("ws"));
const db_1 = __importDefault(require("./db"));
const app_1 = __importDefault(require("./app"));
const server = (0, http_1.createServer)(app_1.default);
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        if (typeof message === 'string') {
            // Handle text message
            console.log(`Received text message: ${message}`);
            // Parse the message if needed
            const parsedMessage = JSON.parse(message);
            // Handle the message based on its content
            if (parsedMessage.action === 'sendMessage') {
                console.log('Received a sendMessage action:', parsedMessage.content);
            }
        }
        else if (message instanceof Buffer) {
            // Handle binary message (if needed)
            console.log('Received binary message:', message);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
app_1.default.use((req, res) => {
    res.send('WebSocket server is running!');
});
(0, db_1.default)();
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});
