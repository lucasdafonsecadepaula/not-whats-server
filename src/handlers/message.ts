import { v4 as uuidv4 } from 'uuid';
import { Io } from '../server';
import { SocketProps } from '../types/socket';

const message = (io: Io, socket: SocketProps) => {
  const { sessionId: mySessionId = '', userName: myUserName = '', chats = {} } = socket.data;
  socket.on('message:send', ({ message: { to, text } }) => {
    const now = new Date().toISOString();
    socket.to(to.id).emit('message:receive', {
      newMessage: {
        id: uuidv4(),
        to,
        from: { id: mySessionId, name: myUserName },
        text,
        createdAt: now,
      },
    });
    socket.emit('message:receive', {
      newMessage: {
        id: uuidv4(),
        to,
        from: { id: mySessionId, name: myUserName },
        text,
        createdAt: now,
      },
    });
  });

  socket.on('message:receive-check', ({ message: { id, from, to, text, createdAt } }) => {
    const friendId = mySessionId === from.id ? to.id : from.id;
    if (chats[friendId]) {
      chats[friendId] = [...chats[friendId], { id, from, to, text, createdAt }];
    } else {
      chats[friendId] = [{ id, from, to, text, createdAt }];
    }
  });

  socket.on('message:history-by-user', ({ userId }) => {
    socket.emit('message:history-by-user', { messages: chats[userId] || [] });
  });
};

export default message;
