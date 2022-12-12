import { Socket } from 'socket.io';
import { Chat, ChatWithOnlyUserType } from './Chat';
import { Message } from './Message';

type SendMessage = {
  message: { to: { id: string; name: string }; from: { id: string; name: string }; text: string };
  chatId: string;
};

export interface ServerToClientEvents {
  'init:session': ({ sessionId }: { sessionId: string }) => void;
  'chat:all-chats': ({ allChats }: { allChats: Chat[] }) => void;
  'chat:new-chat': ({ newChat }: { newChat: Chat }) => void;
  'chat:remove-chat': ({ chat }: { chat: Chat }) => void;
  'config:chat': ({ chat }: { chat: Chat }) => void;
  'config:new-peer': ({ chatPeer }: { chatPeer: { peerId: string; id: string } }) => void;
  'message:receive': ({ newMessage, chatId }: { newMessage: Message; chatId: string }) => void;
  'message:history-by-chat': ({ messages }: { messages: Message[] }) => void;
}

export interface ClientToServerEvents {
  'message:send': ({ message }: SendMessage) => void;
  'message:receive-check': ({ message, chatId }: { message: Message; chatId: string }) => void;
  'message:history-by-chat': ({ chatId }: { chatId: string }) => void;
  'config:my': ({ newConfig }: { newConfig: { name?: string; profileImage?: string } }) => void;
  'config:set-my-peer': ({ peerId }: { peerId: string }) => void;
  'group:create': ({
    group,
  }: {
    group: { groupName: string; groupUsers: ChatWithOnlyUserType[] };
  }) => void;
}

export interface InterServerEvents {}

export type SocketData = {
  name: string;
  sessionId: string;
  profileImage: string;
  chats: { [key: string]: Chat };
  messages: { [key: string]: Message[] };
  peerId: string;
  groups: string[];
};

export type SocketProps = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
