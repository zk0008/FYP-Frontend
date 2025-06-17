import { useCallback, useEffect, useState } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { set } from "react-hook-form";

const supabase = createClient();

export function useFetchChatroom(chatroomId: string) {
  const [chatroom, setChatroom] = useState<Chatroom | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChatroom = useCallback(async () => {
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
    } catch (error: any) {
      console.error("Error fetching chatroom:", error.message);
      setError(error.message);
      setChatroom(null);
    } finally {
      setLoading(false);
    }
  }, [chatroomId]);

  const updateChatroom = useCallback((updatedChatroom: Chatroom) => {
    setChatroom(prev => {
      if (prev?.chatroomId !== updatedChatroom.chatroomId) return prev;

      return { ...prev, ...updatedChatroom };   // updatedChatroom's properties will override prev's, if conflicting
    });
  }, []);

  useEffect(() => {
    fetchChatroom();
  }, [chatroomId, fetchChatroom]);

  return { chatroom, loading, error, refresh: fetchChatroom, updateChatroom };
}
