import { v4 as uuidv4 } from 'uuid';
import { Io } from '../server';
import { SocketProps } from '../types/Socket';

const message = (io: Io, socket: SocketProps) => {
  const { sessionId: mySessionId = '', name: myName = '', chats = {}, messages = {} } = socket.data;
  socket.on('message:send', ({ message: { to, text }, chatId }) => {
    const now = new Date().toISOString();
    const messageid = uuidv4();

    socket.to(chatId).emit('message:receive', {
      newMessage: {
        id: messageid,
        to,
        from: { id: mySessionId, name: myName },
        text,
        createdAt: now,
      },
      chatId: chatId,
    });

    socket.emit('message:receive', {
      newMessage: {
        id: messageid,
        to,
        from: { id: mySessionId, name: myName },
        text,
        createdAt: now,
      },
      chatId: chatId,
    });
  });

  socket.on('message:receive-check', ({ message: { id, from, to, text, createdAt }, chatId }) => {
    if (messages[chatId]) {
      messages[chatId] = [...messages[chatId], { id, from, to, text, createdAt }];
    } else {
      messages[chatId] = [{ id, from, to, text, createdAt }];
    }
  });

  socket.on('message:history-by-chat', ({ chatId }) => {
    socket.emit('message:history-by-chat', { messages: messages[chatId] || [] });
  });
};

export default message;
