import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

interface createChatroomProps {
  chatroomName: string;
}

export function useCreateChatroom() {
  const { user } = useUserContext();

  const createChatroom = useCallback(async ({ chatroomName }: createChatroomProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

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

    if (!response.ok) {
      return { success: false, error: data?.error || "Failed to create chatroom." };
    }

    return { success: true, error: null };
  }, [user]);

  return { createChatroom };
}
