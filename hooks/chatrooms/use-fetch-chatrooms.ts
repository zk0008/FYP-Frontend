import { useCallback, useEffect, useState } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useFetchChatrooms({ userId }: { userId: string }) {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatrooms = useCallback(async () => {
    if (!userId) return;

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
          creatorId: item.creator_id,
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
  }, [userId]);

  const updateChatrooms = useCallback((updatedChatroom: Chatroom) => {
    setChatrooms(prev => {
      // Real-time updates will relay every single chatroom update, even if the chatroom is not in the user's chatrooms list
      // So, first check if the chatroomId is in the current chatrooms list
      // If not, return the previous state unchanged
      if (!prev.some(chatroom => chatroom.chatroomId === updatedChatroom.chatroomId)) return prev;

      // If updatedChatroom is in the current chatrooms list, return updated chatrooms list with the updated chatroom
      return prev.map(chatroom =>
        chatroom.chatroomId === updatedChatroom.chatroomId
          ? { ...chatroom, ...updatedChatroom } // updatedChatroom's properties will override chatroom's, if conflicting
          : chatroom
      );
    });
  }, []);

  useEffect(() => {
    fetchChatrooms();
  }, [userId]);

  return { chatrooms, loading, error, refresh: fetchChatrooms, updateChatrooms };
}
