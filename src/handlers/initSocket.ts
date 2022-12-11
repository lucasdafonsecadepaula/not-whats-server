import { v4 as uuidv4 } from 'uuid';
import { cache, Io } from '../server';
import { SocketProps } from '../types/socket';

const initSocket = (io: Io, socket: SocketProps) => {
  if (typeof socket.handshake.auth.userName !== 'string') return;
  if (typeof socket.handshake.query.profileImage !== 'string') return;

  if (!socket.handshake.auth.sessionId) {
    const newSession = uuidv4();
    socket.emit('init:session', { sessionId: newSession });
    socket.data.chats = {};
    socket.data.sessionId = newSession;
    socket.handshake.auth.sessionId = newSession;
  } else {
    socket.data.sessionId = socket.handshake.auth.sessionId;
    socket.data.chats = cache.get(socket.handshake.auth.sessionId)?.chats || {};
  }

  socket.data.id = socket.data.sessionId;
  socket.data.userName = socket.handshake.auth.userName;
  socket.data.profileImage = socket.handshake.query.profileImage;
  socket.join(socket.data.sessionId!);
};

export default initSocket;
