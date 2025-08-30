import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

interface createChatroomProps {
  chatroomName: string;
}

export function useCreateChatroom() {
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUserContext();

  const createChatroom = useCallback(async ({ chatroomName }: createChatroomProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

    setIsCreating(true);
    const response = await fetchWithAuth(`/api/chatrooms/user/${user.userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: chatroomName
      }),
    });
    const data = await response.json();
    setIsCreating(false);

    if (!response.ok) {
      console.error("Error creating chatroom:", data.detail);
      return { success: false, error: data.detail || "Failed to create chatroom." };
    }

    return { success: true, error: null };
  }, [user]);

  return { createChatroom, isCreating };
}
