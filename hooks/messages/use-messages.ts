import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import { Message } from "@/types";

const supabase = createClient();

export function useMessages({ chatroomId }: { chatroomId: string }) {
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

      try {
        const { data, error } = await supabase.rpc("get_chatroom_messages", { p_chatroom_id: chatroomId })

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const messagesData = data.map((item: any) => ({
            messageId: item.message_id,
            username: item.username,
            content: item.content
          }));
          setMessages(messagesData);
        }
      } catch (err: any) {
        console.error("Error fetching messages:", err.message);
        setError(err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatroomId]);

  return { messages, loading, error };
}
