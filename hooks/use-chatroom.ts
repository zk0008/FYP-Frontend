import { useEffect, useState } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useChatroom(chatroomId: string) {
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatroom = async () => {
      if (!chatroomId) {
        setChatroom(null);
        setLoading(false);
        return;
      }

      setChatroom(null);
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("chatrooms")
          .select("chatroom_id, name, creator_id")
          .eq("chatroom_id", chatroomId)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Chatroom not found.");
        }

        setChatroom({
          chatroomId: data.chatroom_id,
          name: data.name,
          creatorId: data.creator_id,
        });
      } catch (err: any) {
        console.error("Error fetching chatroom:", err.message);
        setError(err.message);
        setChatroom(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChatroom();
  }, [chatroomId]);

  return { chatroom, loading, error };
}
