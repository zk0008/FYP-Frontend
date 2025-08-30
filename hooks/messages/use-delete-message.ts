import { useCallback } from "react";

import { useUnifiedChatroomContext } from "@/hooks";
import { fetchWithAuth } from "@/utils";

interface deleteMessageProps {
  messageId: string;
}

export function useDeleteMessage() {
  const { currentChatroom } = useUnifiedChatroomContext();

  const deleteMessage = useCallback(async ({ messageId }: deleteMessageProps) => {
    if (!currentChatroom) {
      return { success: false, error: "Chatroom context not available." };
    }

    const response = await fetchWithAuth(`/api/messages/${currentChatroom.chatroomId}/${messageId}`, {
      method: "DELETE"
    });
    const data = await response.json()

    if (!response.ok) {
      console.error("Error deleting message:", data.detail);
      return { success: false, error: data.detail || "Failed to delete message." };
    }

    return { success: true, error: null };
  }, [currentChatroom]);

  return { deleteMessage };
}
