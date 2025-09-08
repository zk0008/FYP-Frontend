export interface Chatroom {
  chatroomId: string;
  name: string;
  creatorId: string;
}

export interface Document {
  documentId: string;
  filename: string;
  username: string;  // "[deleted]" if user does not exist
  uploadedAt: string;  // ISO string format
}

// For attachment uploads
export interface AttachmentInput {
  attachmentId: string;  // For element key only
  filename: string;
  preview?: string;  // Base64 string for image preview
  file: File;  // The actual file object for upload
}

// For attachments from Supabase, as part of an already-sent message
export interface Attachment {
  attachmentId: string;
  mimeType: string;
  filename: string;
}

export interface Message {
  messageId: string;
  username: string;  // "[deleted]" if user does not exist
  content: string;
  sentAt: string;
  attachments?: Attachment[];
}

export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface Invite {
  inviteId: string;
  senderUsername: string;  // "[deleted]" if user does not exist
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
