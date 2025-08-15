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

// For attachment uploads
export interface AttachmentInput {
  attachmentId: string;
  type: "IMAGE" | "DOCUMENT";
  filename: string;
  preview?: string;  // Base64 string for image preview
  file: File;  // The actual file object for upload
}

// For attachments from Supabase, as part of an already-sent message
export interface Attachment {
  attachmentId: string;
  type: "IMAGE" | "DOCUMENT";  // "IMAGE" if .png/.jpeg, otherwise "DOCUMENT", for icons use
  filename: string;

  // url: string;  // https://[project-id].supabase.co/storage/v1/object/public/[bucket-name]/[chatroom-id]/[attachment-id]
  // TODO: Explore use of Supabase URL directly to open new tab with file attachment, format: [chatroom-id]/[attachment-id]
}

export interface Message {
  messageId: string;
  username: string;
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
