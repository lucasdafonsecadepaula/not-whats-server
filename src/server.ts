import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import configHandler from './handlers/config';
import groupsHandler from './handlers/groups';
import initSocket from './handlers/initSocket';
import messageHandler from './handlers/message';
import usersConnectionHandler from './handlers/usersConnection';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  SocketProps,
} from './types/Socket';

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

export const cache = new Map<string, Partial<SocketData>>(); // My DB :D
export const TIME_TO_CLEAR_CACHE = 1000 * 60 * 5; // 5 minutes

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  server,
  {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  },
);

app.get('/', (req, res) => {
  res.status(200).send('Not Whats Socket Server');
});

const onConnection = (socket: SocketProps) => {
  initSocket(io, socket);
  usersConnectionHandler(io, socket);
  messageHandler(io, socket);
  groupsHandler(io, socket);
  configHandler(io, socket);
};

io.on('connection', onConnection);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

export type Io = typeof io;
