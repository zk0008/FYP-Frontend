import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUnifiedChatroomContext } from "@/hooks";

interface deleteDocumentProps {
  documentId: string;
}

export function useDeleteDocument() {
  const { currentChatroom } = useUnifiedChatroomContext();

  const deleteDocument = useCallback(async ({ documentId }: deleteDocumentProps) => {
    if (!documentId) {
      return { success: false, error: "Document ID is required." };
    } else if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Current chatroom context is not available." };
    }

    const response = await fetchWithAuth(`/api/documents/${currentChatroom.chatroomId}/${documentId}`, {
      method: "DELETE"
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data?.error || "Failed to delete document." };
    }

    return { success: true, error: null };
  }, [currentChatroom]);

  return { deleteDocument };
}
