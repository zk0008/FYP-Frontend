import { useState } from "react";

import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

const supabase = createClient();

interface DeleteChatroomParams {
  chatroomId: string;
  name: string;
}

export function useDeleteChatroom() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); 

  const deleteChatroom = async ({ chatroomId, name }: DeleteChatroomParams) => {
    if (!chatroomId || !name) {
      toast({
        title: "Invalid Parameters",
        description: "Chatroom ID and name are required to delete a chatroom.",
        variant: "destructive",
      });
      return { success: false, error: "Chatroom ID and name are required." };
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("chatrooms")
        .delete()
        .eq("chatroom_id", chatroomId);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Chatroom Deleted",
        description: `Chatroom '${name}' has been successfully deleted.`,
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting chatroom:", error);

      toast({
        title: "Error Deleting Chatroom",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });

      return { success: false, error: error.message || "An unexpected error occurred." };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteChatroom, isLoading };
}
