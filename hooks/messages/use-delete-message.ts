import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUnifiedChatroomContext } from "@/hooks";

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
      return { success: false, error: data.message || "Failed to delete message." };
    }

    return { success: true, error: null };
  }, [currentChatroom]);

  return { deleteMessage };
}
