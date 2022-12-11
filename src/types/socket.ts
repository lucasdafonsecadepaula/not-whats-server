import { Socket } from 'socket.io';
import { Group } from './Group';
import { Message } from './Message';
import { User } from './User';

type UserProps = { id: string; name: string; profileImage: string | null };
type UsersWithLastMessage = UserProps & { lastMessage: Message | null };
type SendMessage = { message: { to: { id: string; name: string }; text: string } };

export interface ServerToClientEvents {
  'init:session': ({ sessionId }: { sessionId: string }) => void;
  'user:all-users': ({ allUsers }: { allUsers: UsersWithLastMessage[] }) => void;
  'user:new-user-connected': ({ newUser }: { newUser: UsersWithLastMessage }) => void;
  'user:user-disconnected': ({ user }: { user: UserProps }) => void;
  'config:user': ({ user }: { user: UserProps }) => void;
  'config:new-peer': ({ userPeer }: { userPeer: { peerId: string; id: string } }) => void;
  'message:receive': ({ newMessage }: { newMessage: Message }) => void;
  'message:history-by-user': ({ messages }: { messages: Message[] }) => void;
  'group:delete': ({ group }: { group: Group }) => void;
  'group:created': ({ group }: { group: Group }) => void;
}

export interface ClientToServerEvents {
  'message:send': ({ message }: SendMessage) => void;
  'message:receive-check': ({ message }: { message: Message }) => void;
  'message:history-by-user': ({ userId }: { userId: string }) => void;
  'config:my': ({ newConfig }: { newConfig: Partial<UserProps> }) => void;
  'config:set-my-peer': ({ peerId }: { peerId: string }) => void;
  'group:create': ({ group }: { group: Omit<Group, 'id'> }) => void;
}

export interface InterServerEvents {}

export type SocketData = User & { peerId: string };

export type SocketProps = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
