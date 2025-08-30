import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUnifiedChatroomContext } from "@/hooks";

interface editChatroomProps {
  chatroomName: string;
}

export function useEditChatroom() {
  const { currentChatroom } = useUnifiedChatroomContext();

  const editChatroom = useCallback(async ({ chatroomName }: editChatroomProps) => {
    if (!currentChatroom) {
      return { success: false, error: "Chatroom context is not available." };
    }

    const response = await fetchWithAuth(`/api/chatrooms/${currentChatroom.chatroomId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: chatroomName
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data?.error || "Failed to edit chatroom." };
    }

    return { success: true, error: null };
  }, [currentChatroom]);

  return { editChatroom };
}
