import { v4 as uuidv4 } from 'uuid';
import { cache, Io } from '../server';
import { SocketProps } from '../types/Socket';

const initSocket = (io: Io, socket: SocketProps) => {
  const { name, profileImage, sessionId } = socket.handshake.auth;
  if (typeof name !== 'string') return;
  if (typeof profileImage !== 'string') return;

  if (!sessionId) {
    const newSession = uuidv4();
    socket.emit('init:session', { sessionId: newSession });
    socket.data = {
      name: name,
      sessionId: newSession,
      profileImage: profileImage,
      chats: {},
      messages: {},
      peerId: '',
      groups: [],
    };
  } else {
    socket.data = cache.get(socket.handshake.auth.sessionId) || {
      name: name,
      sessionId: sessionId,
      profileImage: profileImage,
      chats: {},
      messages: {},
      peerId: '',
      groups: [],
    };
  }

  socket.join(socket.data.sessionId!);
};

export default initSocket;
