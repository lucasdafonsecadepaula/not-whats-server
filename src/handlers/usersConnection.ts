import { Chat } from '@/types/Chat';
import { cache, Io, TIME_TO_CLEAR_CACHE } from '../server';
import { SocketProps } from '../types/Socket';

const usersConnection = (io: Io, socket: SocketProps) => {
  const {
    sessionId: mySessionId = '',
    profileImage: myProfileImage = '',
    name: myName = '',
    messages: myMessages = {},
  } = socket.data;

  const allChatsArr: Chat[] = [];
  const chats: { [key: string]: Chat } = {};

  for (let [id, friendSocket] of io.of('/').sockets) {
    if (id !== socket.id) {
      const { messages = {}, sessionId = '', profileImage = '', name = '' } = friendSocket.data;
      const previusMessages = messages[mySessionId] || myMessages[sessionId];
      const lastMessage = previusMessages && previusMessages[previusMessages.length - 1];
      const chat = {
        id: sessionId,
        name: name,
        lastMessage: lastMessage,
        profileImage: profileImage,
        type: 'user',
      } as const;
      allChatsArr.push(chat);
      chats[sessionId] = chat;
      socket.to(friendSocket.handshake.auth.sessionId).emit('chat:new-chat', {
        newChat: {
          name: myName,
          id: mySessionId,
          lastMessage,
          profileImage: myProfileImage,
          type: 'user',
        },
      });
    }
  }
  socket.data.chats = {...(socket.data.chats || {}), ...chats};
  socket.emit('chat:all-chats', { allChats: allChatsArr });

  socket.on('disconnect', () => {
    socket.broadcast.emit('chat:remove-chat', {
      chat: {
        id: mySessionId,
        name: myName,
        profileImage: myProfileImage,
        type: 'user',
      },
    });

    cache.set(mySessionId, socket.data);

    setTimeout(() => {
      cache.delete(mySessionId);
    }, TIME_TO_CLEAR_CACHE);
  });
};

export default usersConnection;
