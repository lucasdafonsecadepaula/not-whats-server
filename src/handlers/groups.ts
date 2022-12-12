import { v4 as uuidv4 } from 'uuid';
import { Io } from '../server';
import { SocketProps } from '../types/Socket';

const DEFAULT_GROUP_IMAGE = 'https://freeiconshop.com/wp-content/uploads/edd/many-people-solid.png';

const groups = (io: Io, socket: SocketProps) => {
  console.log('groups', socket.data.groups);
  if (socket.data.groups) {
    socket.data.groups.forEach((groupId) => {
      socket.join(groupId);
      const chat = socket.data.chats && socket.data.chats[groupId];
      console.log('chat', chat);
      const messages = socket.data.messages && socket.data.messages[groupId];
      const lastMessage = messages && messages[messages.length - 1];
      if (chat) {
        socket.emit('chat:new-chat', { newChat: { ...chat, lastMessage } });
      }
    });
  }

  socket.on('group:create', ({ group: { groupName, groupUsers } }) => {
    const groupId = uuidv4();
    socket.join(groupId);

    socket.data.chats = {
      ...(socket.data.chats || {}),
      [groupId]: { id: groupId, profileImage: DEFAULT_GROUP_IMAGE, name: groupName, type: 'group' },
    };
    socket.data.groups = [...(socket.data.groups || []), groupId];

    for (let [id, socketObj] of io.of('/').sockets) {
      if (id !== socket.id && groupUsers.some((user) => user.id === socketObj.data.sessionId)) {
        socketObj.data.chats = {
          ...(socketObj.data.chats || {}),
          [groupId]: {
            id: groupId,
            profileImage: DEFAULT_GROUP_IMAGE,
            name: groupName,
            type: 'group',
          },
        };
        socketObj.data.groups = [...(socketObj.data.groups || []), groupId];
        socketObj.join(groupId);
      }
    }

    io.to(groupId).emit('chat:new-chat', {
      newChat: { id: groupId, profileImage: DEFAULT_GROUP_IMAGE, name: groupName, type: 'group' },
    });
  });
};

export default groups;
