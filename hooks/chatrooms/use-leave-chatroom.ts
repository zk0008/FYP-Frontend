import { useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

const supabase = createClient();

interface LeaveChatroomParams {
  userId: string;
  chatroomId: string;
  name: string;
}

export function useLeaveChatroom() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const leaveChatroom = async ({ userId, chatroomId, name }: LeaveChatroomParams) => {
    if (!userId || !chatroomId || !name) {
      toast({
        title: "Invalid Parameters",
        description: "User ID, chatroom ID, and name are required to leave a chatroom.",
        variant: "destructive",
      });
      return { success: false, error: "User ID, chatroom ID, and name are required." };
    }

    setIsLoading(true);

    try {
      console.log("userId:", userId);
      console.log("chatroomId:", chatroomId);

      const { error } = await supabase
        .from("members")
        .delete()
        .eq("user_id", userId)
        .eq("chatroom_id", chatroomId);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Left Chatroom",
        description: `You have successfully left the chatroom '${name}'.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error leaving chatroom:", error);

      toast({
        title: "Error Leaving Chatroom",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });

      return { success: false, error: error.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  return { leaveChatroom, isLoading };
}
