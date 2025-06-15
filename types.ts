export interface Chatroom {
  chatroomId: string;
  name: string;
  creatorId: string;
}

export interface Document {
  documentId: string;
  filename: string;
  username: string;
  uploadedAt: string;   // ISO string format
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

export interface Invite {
  inviteId: string;
  senderUsername: string;
  chatroomId: string;
  chatroomName: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}
