import { useEffect } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";

interface useRealtimeChatroomProps {
  onUpdateChatroom: (chatroom: Chatroom) => void;
  onDeleteChatroom: (chatroomId: string) => void;
}

interface ChatroomPayload {
  chatroom_id: string;
  creator_id: string;
  name: string;
  created_at: string;
}

const supabase = createClient();

export function useRealtimeChatroom({
  onUpdateChatroom,
  onDeleteChatroom
}: useRealtimeChatroomProps) {
  useEffect(() => {
    const channel = supabase
      .channel("chatrooms")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chatrooms" },
        async (payload: { new: ChatroomPayload }) => {
          const updatedChatroom = payload.new;

          const chatroomData: Chatroom = {
            chatroomId: updatedChatroom.chatroom_id,
            name: updatedChatroom.name,
            creatorId: updatedChatroom.creator_id
          };

          onUpdateChatroom(chatroomData);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chatrooms" },
        (payload) => {
          const deletedChatroomId = payload.old.chatroom_id;
          onDeleteChatroom(deletedChatroomId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdateChatroom, onDeleteChatroom]);
}
