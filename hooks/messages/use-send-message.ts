import { useState, useCallback } from "react";

import { fetchWithAuth } from "@/utils";
import { useUnifiedChatroomContext } from "@/hooks";
import { AttachmentInput } from "@/types";

export function useSendMessage() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const { currentChatroom } = useUnifiedChatroomContext();

  const sendMessage = useCallback(async ({ content, attachments } : { content: string, attachments?: AttachmentInput[] }): Promise<{ success: boolean, error?: string }> => {
    if (!currentChatroom?.chatroomId) {
      return { success: false, error: "No chatroom selected." }
    }

    setIsSending(true);

    const payload = new FormData();
    payload.append("content", content.trim());

    if (attachments && attachments.length > 0) {
      attachments.forEach(attachment => {
        payload.append("attachments", attachment.file);
      });
    }

    const response = await fetchWithAuth(`/api/messages?chatroom_id=${currentChatroom.chatroomId}`, {
      method: "POST",
      body: payload,
    });
    const data = await response.json();

    setIsSending(false);

    if (!response.ok) {
      console.error("Error sending message:", data.detail);
      return { success: false, error: data.detail || "An error occurred when sending the message." };
    }

    return { success: true };
  }, [currentChatroom]);

  return { isSending, sendMessage };
}
