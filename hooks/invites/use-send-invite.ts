import { useCallback, useState } from "react";

import { fetchWithAuth } from "@/utils";

interface sendInviteProps {
  chatroomId: string;
  recipientUsername: string;
}

export function useSendInvite() {
  const [isSending, setIsSending] = useState<boolean>(false);

  const sendInvite = useCallback(async ({ chatroomId, recipientUsername }: sendInviteProps) => {
    setIsSending(true);

    const response = await fetchWithAuth(`/api/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatroom_id: chatroomId,
        recipient_username: recipientUsername
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error sending invite:", data.detail);
      setIsSending(false);
      return { success: false, error: data.detail || "Failed to send invite." };
    }

    setIsSending(false);
    return { success: true, error: null };
  }, []);

  return { sendInvite, isSending };
}
