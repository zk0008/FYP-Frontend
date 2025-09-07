import { useEffect, useState } from "react";

import { Message } from "@/types";
import { fetchWithAuth } from "@/utils";

interface useFetchMessagesProps {
  chatroomId: string;
}

export function useFetchMessages({ chatroomId }: useFetchMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatroomId) {
      // Skip fetching messages if chatroomId is not available
      return;
    }

    const fetchMessages = async () => {
      setMessages([]);
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(`/api/messages?chatroom_id=${chatroomId}`, {
        method: "GET"
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("Error fetching messages:", data.detail);
        setLoading(false);
        setError(data.detail || "Failed to fetch messages");
        return;
      }

      const messagesData: Message[] = data.map((item: any) => ({
        messageId: item.message_id,
        username: item?.username || "[deleted]",
        content: item.content,
        attachments: (item.attachments || []).map((attachment: any) => ({
          attachmentId: attachment.attachment_id,
          mimeType: attachment.mime_type,
          filename: attachment.filename
        }))
      }));
      setLoading(false);
      setMessages(messagesData);
    };

    fetchMessages();
  }, [chatroomId]);

  return { messages, loading, error };
}
