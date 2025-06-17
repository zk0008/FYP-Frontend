import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks";

interface useDeleteMessageProps {
  messageId: string;
}

const supabase = createClient();

export function useDeleteMessage({ messageId }: useDeleteMessageProps) {
  const { toast } = useToast();

  const deleteMessage = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("message_id", messageId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error Deleting Message",
        description: error.message || "An unexpected error occurred when deleting the message.",
        variant: "destructive",
      });
      return false;
    }
  }, [messageId]);

  return { deleteMessage };
}
