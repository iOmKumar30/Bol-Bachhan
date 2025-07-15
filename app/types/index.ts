import { Conversation, Message, User } from "@prisma/client";

export type CompleteMessageType = Message & {
  sender: User;
  seen: User[];
};

export type CompleteConversationType = Conversation & {
  users: User[];
  messages: CompleteMessageType[];
};
