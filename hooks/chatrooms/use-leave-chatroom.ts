import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";
import { useUserContext } from "@/hooks";

interface leaveChatroomProps {
  chatroomId: string;
}

export function useLeaveChatroom() {
  const [isLeaving, setIsLeaving] = useState(false);
  const { user } = useUserContext();

  const leaveChatroom = useCallback(async ({ chatroomId }: leaveChatroomProps) => {
    if (!user) {
      return { success: false, error: "User context is not available." };
    }

    setIsLeaving(true);
    const response = await fetchWithAuth(`/api/chatrooms/${chatroomId}/user/${user.userId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    setIsLeaving(false);

    if (!response.ok) {
      console.error("Error leaving chatroom:", data.detail);
      return { success: false, error: data.detail || "Failed to leave chatroom." };
    }

    return { success: true, error: null };
  }, [user]);

  return { leaveChatroom, isLeaving };
}
