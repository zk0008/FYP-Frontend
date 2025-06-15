// hooks/index.ts - Main export file

// =============================================================================
// CONTEXTS (Global State Management)
// =============================================================================
export { useChatroomContext } from "./contexts/use-chatroom-context";
export { useChatroomsContext } from "./contexts/use-chatrooms-context";
export { useInvitesContext } from "./contexts/use-invites-context";
export { useUserContext } from "./contexts/use-user-context";

// =============================================================================
// AUTHENTICATION & USER
// =============================================================================
export { useFetchUser } from "./auth/use-fetch-user";

// =============================================================================
// CHATROOMS
// =============================================================================
export { useFetchChatroom } from "./chatrooms/use-fetch-chatroom";
export { useFetchChatrooms } from "./chatrooms/use-fetch-chatrooms";
export { useDeleteChatroom } from "./chatrooms/use-delete-chatroom";
export { useLeaveChatroom } from "./chatrooms/use-leave-chatroom";

// =============================================================================
// MESSAGES
// =============================================================================
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
export { useFetchDocuments } from "./documents/use-fetch-documents";
export { useRealtimeDocuments } from "./documents/use-realtime-documents";
export { useUploadDocument } from "./documents/use-upload-document";
export { useDeleteDocument } from "./documents/use-delete-document";
export { useDownloadDocument } from "./documents/use-download-document";
export { useDragAndDrop } from "./documents/use-drag-and-drop";

// =============================================================================
// UI & UTILITIES
// =============================================================================
export { useChatInput } from "./ui/use-chat-input";
export { useIsMobile } from "./ui/use-mobile";
export { useToast } from "./ui/use-toast";
