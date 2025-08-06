export interface Chatroom {
  chatroomId: string;
  name: string;
  creatorId: string;
}

export interface Document {
  documentId: string;
  filename: string;
  username: string;
  uploadedAt: string;  // ISO string format
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

// Context types
export interface InvitesContextType {
  invites: Invite[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface UnifiedChatroomContextType {
  chatrooms: Chatroom[];  // Chatrooms list
  currentChatroom: Chatroom | null;  // Current chatroom
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};
