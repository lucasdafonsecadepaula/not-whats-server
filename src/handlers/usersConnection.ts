import { Message } from '@/types/Message';
import { cache, Io, TIME_TO_CLEAR_CACHE } from '../server';
import { SocketProps } from '../types/socket';

const usersConnection = (io: Io, socket: SocketProps) => {
  const {
    sessionId: mySessionId = '',
    profileImage: myProfileImage = '',
    userName: myUserName = '',
  } = socket.data;

  const allUsers = [];

  for (let [id, socketObj] of io.of('/').sockets) {
    if (id !== socket.id) {
      const { chats = {}, sessionId = '', profileImage = '', userName = '' } = socketObj.data;

      const previusChat = chats[mySessionId];
      const lastMessage = previusChat ? previusChat[previusChat.length - 1] : null;
      allUsers.push({
        id: sessionId as string,
        name: userName as string,
        lastMessage: lastMessage as Message | null,
        profileImage: profileImage as string,
      });
      socket.to(socketObj.handshake.auth.sessionId).emit('user:new-user-connected', {
        newUser: {
          name: myUserName,
          id: mySessionId,
          lastMessage,
          profileImage: myProfileImage,
        },
      });
    }
  }
  socket.emit('user:all-users', { allUsers });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user:user-disconnected', {
      user: {
        id: mySessionId,
        name: myUserName,
        profileImage: myProfileImage,
      },
    });
    cache.set(mySessionId, socket.data);
    setTimeout(() => {
      cache.delete(mySessionId);
    }, TIME_TO_CLEAR_CACHE);
  });
};

export default usersConnection;
