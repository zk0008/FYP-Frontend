import { useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { useUnifiedChatroomContext } from "@/hooks";

interface useDeleteMessageProps {
  messageId: string;
}

const supabase = createClient();

export function useDeleteMessage({ messageId }: useDeleteMessageProps) {
  const { currentChatroom } = useUnifiedChatroomContext();

  const deleteMessageAttachments = useCallback(async () => {
    if (!currentChatroom) {
      return { success: false, error: "Chatroom context not available." };
    }

    try {
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("attachments")
        .select("attachment_id")
        .eq("message_id", messageId);

      if (attachmentsError) {
        throw new Error(attachmentsError.message);
      }

      if (attachmentsData && attachmentsData.length > 0) {
        const attachmentsToDelete = attachmentsData.map((attachment: any) => `${currentChatroom.chatroomId}/${attachment.attachment_id}`);

        const { error } = await supabase
          .storage
          .from("attachments")
          .remove(attachmentsToDelete);

        if (error) {
          throw new Error(error.message);
        }
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting message attachments:", error);
      return { success: false, error: error.message || "Failed to delete message attachments." };
    }
  }, [currentChatroom, messageId]);

  const deleteMessage = useCallback(async () => {
    try {
      const { error: attachmentsError } = await deleteMessageAttachments();

      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("message_id", messageId);

      if (attachmentsError || messagesError) {
        throw new Error(attachmentsError?.message || messagesError?.message);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error deleting message:", error);
      return { success: false, error: error.message || "Failed to delete the message." };
    }
  }, [messageId]);

  return { deleteMessage };
}
