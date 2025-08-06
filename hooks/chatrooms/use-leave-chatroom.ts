import { useState } from "react";

import { createClient } from "@/utils/supabase/client";

interface leaveChatroomProps {
  userId: string;
  chatroomId: string;
  name: string;
}

const supabase = createClient();

export function useLeaveChatroom() {
  const [isLoading, setIsLoading] = useState(false);

  const leaveChatroom = async ({ userId, chatroomId, name }: leaveChatroomProps) => {
    if (!userId || !chatroomId || !name) {
      return { success: false, error: "User ID, chatroom ID, and name are required to leave a chatroom." };
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("user_id", userId)
        .eq("chatroom_id", chatroomId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error leaving chatroom:", error);
      return { success: false, error: error.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  return { leaveChatroom, isLoading };
}
