import { v4 as uuidv4 } from 'uuid';
import { Io } from '../server';
import { SocketProps } from '../types/socket';

const groups = (io: Io, socket: SocketProps) => {
  socket.on('group:create', ({ group }) => {
    const groupId = uuidv4();
    socket.join(groupId);

    for (let [id, socketObj] of io.of('/').sockets) {
      if (id !== socket.id) {
        socketObj.join(groupId);
      }
    }

    io.to(groupId).emit('group:created', { group: { id: groupId, ...group } });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('group:delete', {
      group: {
        id: socket.id,
        userName: socket.data.userName!,
        profileImage: socket.data.profileImage!,
      },
    });
  });
};

export default groups;
