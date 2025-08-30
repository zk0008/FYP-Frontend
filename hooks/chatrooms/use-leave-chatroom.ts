import { useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

interface leaveChatroomProps {
  chatroomId: string;
}

export function useLeaveChatroom() {
  const { user } = useUserContext();

  const leaveChatroom = useCallback(async ({ chatroomId }: leaveChatroomProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

    const response = await fetchWithAuth(`/api/chatrooms/${chatroomId}/user/${user.userId}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to leave chatroom." };
    }

    return { success: true, error: null };
  }, [user]);

  return { leaveChatroom };
}
