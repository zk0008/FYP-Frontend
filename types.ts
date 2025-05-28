export interface Chatroom {
  chatroomId: string;
  name: string
  // TODO: Chatroom created timestamp
}

export interface Message {
  messageId: string;
  username: string;
  content: string;
  // TODO: Message sent timestamp
}

export interface User {
  userId: string;
  username: string;
  email: string;
}
