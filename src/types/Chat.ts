import { Message } from './Message';

export type Chat = {
  id: string;
  name: string;
  profileImage: string | null;
  type: 'user' | 'group';
  lastMessage?: Message | null;
  notificationCount?: number;
  peerId?: string;
};

export type ChatWithOnlyUserType = Chat & { type: 'user' };

export type ChatMap = Map<string, Chat>;

export type ChatWithOnlyUserTypeMap = Map<string, ChatWithOnlyUserType>;
