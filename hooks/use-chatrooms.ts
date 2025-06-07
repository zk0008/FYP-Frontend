import { useEffect, useState } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useChatrooms({ userId }: { userId: string }) {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      // Some time is required to fetch userId, so skip fetching chatrooms if it is not available
      // When userId is available, this effect will re-run since it is a dependency
      return;
    }

    const fetchChatrooms = async () => {
      setChatrooms([]);
      setLoading(true);
      setError(null);

      try {
        // Chatrooms ordered by most recently joined
        const { data, error } = await supabase.rpc("get_user_chatrooms_ordered", { p_user_id: userId });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const chatroomsData = data.map((item: any) => ({
            chatroomId: item.chatroom_id,
            name: item.name
          }));
          setChatrooms(chatroomsData);
        }
      } catch (error: any) {
        console.error("Error fetching chatrooms:", error.message);
        setError(error.message);
        setChatrooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, [userId]);

  return { chatrooms, loading, error };
}
