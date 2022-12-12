import { Io } from '../server';
import { SocketProps } from '../types/Socket';

const config = (io: Io, socket: SocketProps) => {
  socket.on('config:my', ({ newConfig }) => {
    if (newConfig?.name) {
      socket.handshake.auth.name = newConfig.name;
      socket.data.name = newConfig.name;
    }
    if (newConfig?.profileImage) {
      socket.data.profileImage = newConfig.profileImage;
    }
    socket.broadcast.emit('config:chat', {
      chat: {
        id: socket.data.sessionId || 'not-found',
        name: socket.data.name || 'not-found',
        profileImage: socket.data.profileImage || null,
        type: 'user',
      },
    });
  });

  socket.on('config:set-my-peer', ({ peerId }) => {
    socket.data.peerId = peerId;
    socket.broadcast.emit('config:new-peer', {
      chatPeer: {
        id: socket.data.sessionId || 'not-found',
        peerId,
      },
    });
  });
};

export default config;
