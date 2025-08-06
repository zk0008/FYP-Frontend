import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";

interface useDeleteMessageProps {
  messageId: string;
}

const supabase = createClient();

export function useDeleteMessage({ messageId }: useDeleteMessageProps) {
  const deleteMessage = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("message_id", messageId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting message:", error);
      return { success: false, error: error.message || "Failed to delete the message." };
    }
  }, [messageId]);

  return { deleteMessage };
}
