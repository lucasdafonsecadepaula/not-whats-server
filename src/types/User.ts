import { Message } from './Message';

export type User = {
  id: string;
  userName: string;
  sessionId: string;
  profileImage: string;
  chats: {
    [key: string]: Message[];
  };
};
