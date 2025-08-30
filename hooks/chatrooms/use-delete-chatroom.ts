import { useState } from "react";

import { fetchWithAuth } from "@/utils";

interface deleteChatroomProps {
  chatroomId: string;
  name: string;
}

export function useDeleteChatroom() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteChatroom = async ({ chatroomId, name }: deleteChatroomProps) => {
    if (!chatroomId || !name) {
      return { success: false, error: "Chatroom ID and name are required." };
    }

    setIsDeleting(true);
    const response = await fetchWithAuth(`/api/chatrooms/${chatroomId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    setIsDeleting(false);

    if (!response.ok) {
      console.error("Error deleting chatroom:", data.detail);
      return { success: false, error: data.detail || "Failed to delete chatroom." };
    }

    return { success: true, error: null };
  };

  return { deleteChatroom, isDeleting };
}
