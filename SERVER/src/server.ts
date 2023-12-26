import dotenv from 'dotenv';
dotenv.config({ path: '.env' });


import { createServer } from 'http'; // Change to use the http module
import { Server } from 'socket.io';

import db from './db';
import app from './app';

const httpServer = createServer(app); // Create an HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
}); // Attach socket.io to the http server

const port = process.env.PORT || 3000;

db();

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
