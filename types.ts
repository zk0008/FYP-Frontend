export interface Chatroom {
  chatroomId: string;
  name: string;
}

export interface Document {
  documentId: string;
  uploaderId: string;
  chatroomId: string;
  filename: string;
}

export interface Message {
  messageId: string;
  username: string;
  content: string;
  sentAt: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
}
