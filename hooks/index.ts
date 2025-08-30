// hooks/index.ts - Main export file

// =============================================================================
// CONTEXTS (Global State Management)
// =============================================================================
export { useInvitesContext } from "./contexts/use-invites-context";
export { useUnifiedChatroomContext } from "./contexts/use-unified-chatroom-context";
export { useUserContext } from "./contexts/use-user-context";

// =============================================================================
// ATTACHMENTS
// =============================================================================
export { useAttachmentManager } from "./attachments/use-attachment-manager";
export { useDropAttachment } from "./attachments/use-drop-attachment";
export { useDeleteAttachment } from "./attachments/use-delete-attachment";
export { useFetchAttachmentUrl } from "./attachments/use-fetch-attachment-url";
export { useUploadAttachment } from "./attachments/use-upload-attachment";

// =============================================================================
// AUTHENTICATION
// =============================================================================
export { useFetchUser } from "./auth/use-fetch-user";

// =============================================================================
// CHATROOMS
// =============================================================================
export { useCreateChatroom } from "./chatrooms/use-create-chatroom";
export { useDeleteChatroom } from "./chatrooms/use-delete-chatroom";
export { useEditChatroom } from "./chatrooms/use-edit-chatroom";
export { useFetchChatroom } from "./chatrooms/use-fetch-chatroom";
export { useFetchChatrooms } from "./chatrooms/use-fetch-chatrooms";
export { useLeaveChatroom } from "./chatrooms/use-leave-chatroom";
export { useRealtimeChatroom } from "./chatrooms/use-realtime-chatroom";

// =============================================================================
// MESSAGES
// =============================================================================
export { useDeleteMessage } from "./messages/use-delete-message";
export { useMessagesWithRealtime } from "./messages/use-messages-with-realtime";
export { useSendMessage } from "./messages/use-send-message";

// =============================================================================
// INVITES
// =============================================================================
export { useFetchInvites } from "./invites/use-fetch-invites";
export { useRealtimeInvites } from "./invites/use-realtime-invites";
export { useAcceptInvite } from "./invites/use-accept-invite";
export { useRejectInvite } from "./invites/use-reject-invite";

// =============================================================================
// DOCUMENTS
// =============================================================================
export { useDocumentsWithRealtime } from "./documents/use-documents-with-realtime";
export { useDropDocument } from "./documents/use-drop-document";
export { useUploadDocument } from "./documents/use-upload-document";
export { useDeleteDocument } from "./documents/use-delete-document";
export { useDownloadDocument } from "./documents/use-download-document";

// =============================================================================
// UI & UTILITIES
// =============================================================================
export { useChatInput } from "./ui/use-chat-input";
export { useIsMobile } from "./ui/use-mobile";
export { useToast } from "./ui/use-toast";

//
// =============================================================================
// USER MANAGEMENT
// =============================================================================
export { useDeleteUser } from "./users/use-delete-user";
