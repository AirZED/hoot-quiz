import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { createServer } from 'http'; // Change to use the http module
import WebSocket from 'ws';

import db from './db';
import app from './app';
const server = createServer(app);
const wss = new WebSocket.Server({ server });

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
    } else if (message instanceof Buffer) {
      // Handle binary message (if needed)
      console.log('Received binary message:', message);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.use((req, res) => {
  res.send('WebSocket server is running!');
});

db();

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
