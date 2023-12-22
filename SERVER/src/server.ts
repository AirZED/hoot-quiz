import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

// importing dotenv file
dotenv.config({ path: './../.env' });
import db from './db';

import app from './app';

const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

db();

io.on('connection', (socket) => {
  console.log(socket)
  console.log('a user connected');
});

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
