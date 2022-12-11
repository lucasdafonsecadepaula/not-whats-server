import { Io } from '../server';
import { SocketProps } from '../types/socket';

const config = (io: Io, socket: SocketProps) => {
  socket.on('config:my', ({ newConfig }) => {
    if (newConfig?.name) {
      socket.handshake.auth.userName = newConfig.name;
      socket.data.userName = newConfig.name;
    }
    if (newConfig?.profileImage) {
      socket.data.profileImage = newConfig.profileImage;
    }
    socket.broadcast.emit('config:user', {
      user: {
        id: socket.data.sessionId || 'not-found',
        name: socket.data.userName || 'not-found',
        profileImage: socket.data.profileImage || null,
      },
    });
  });

  socket.on('config:set-my-peer', ({ peerId }) => {
    socket.data.peerId = peerId;
    socket.broadcast.emit('config:new-peer', {
      userPeer: {
        id: socket.data.sessionId || 'not-found',
        peerId,
      },
    });
  });
};

export default config;
