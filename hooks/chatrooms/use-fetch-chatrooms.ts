import { useCallback, useEffect, useState } from "react";

import { Chatroom } from "@/types";
import { fetchWithAuth } from "@/utils";

interface useFetchChatroomsProps {
  userId: string;
}

export function useFetchChatrooms({ userId }: useFetchChatroomsProps) {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatrooms = useCallback(async () => {
    if (!userId) return;

    setChatrooms([]);
    setLoading(true);
    setError(null);

    const response = await fetchWithAuth(`/api/chatrooms/user/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching chatrooms:", data.detail);
      setError(data.detail || "Failed to fetch chatrooms");
      setLoading(false);
      return;
    }

    if (data) {
      const chatroomsData = data.map((item: any) => ({
        chatroomId: item.chatroom_id,
        creatorId: item.creator_id,
        name: item.name
      }));
      setChatrooms(chatroomsData);
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
          ? { ...chatroom, ...updatedChatroom }  // updatedChatroom's properties will override chatroom's, if conflicting
          : chatroom
      );
    });
  }, []);

  const removeChatroom = useCallback((chatroomId: string) => {
    setChatrooms(prev => prev.filter(chatroom => chatroom.chatroomId !== chatroomId));
  }, []);

  useEffect(() => {
    fetchChatrooms();
  }, [userId]);

  return {
    chatrooms,
    loading,
    error,
    refresh: fetchChatrooms,
    updateChatrooms,
    removeChatroom
  };
}
