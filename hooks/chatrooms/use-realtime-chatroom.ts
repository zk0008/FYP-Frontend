import { useEffect } from "react";

import { Chatroom } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

interface ChatroomPayload {
  chatroom_id: string;
  creator_id: string;
  name: string;
  created_at: string;
}

const supabase = createClient();

export function useRealtimeChatroom({ onUpdateChatroom }: { onUpdateChatroom: (chatroom: Chatroom) => void }) {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel("chatrooms")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chatrooms" },
        async (payload: { new: ChatroomPayload }) => {
          console.log("Chatroom updated:", payload);
          const updatedChatroom = payload.new;

          const chatroomData: Chatroom = {
            chatroomId: updatedChatroom.chatroom_id,
            name: updatedChatroom.name,
            creatorId: updatedChatroom.creator_id
          };

          onUpdateChatroom(chatroomData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdateChatroom, toast]);
}
