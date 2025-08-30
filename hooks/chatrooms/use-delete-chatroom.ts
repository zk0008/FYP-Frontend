import { useState } from "react";

import { fetchWithAuth } from "@/utils";

interface deleteChatroomProps {
  chatroomId: string;
  name: string;
}

export function useDeleteChatroom() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteChatroom = async ({ chatroomId, name }: deleteChatroomProps) => {
    if (!chatroomId || !name) {
      return { success: false, error: "Chatroom ID and name are required." };
    }

    setIsLoading(true);

    const response = await fetchWithAuth(`/api/chatrooms/${chatroomId}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to delete chatroom." };
    }

    return { success: true, error: null };
  };

  return { deleteChatroom, isLoading };
}
