import { createClient } from "@/utils/supabase/client";
import { useUnifiedChatroomContext } from "@/hooks";
import { useCallback } from "react";

const supabase = createClient();

export function useDeleteAttachment() {
  const { currentChatroom } = useUnifiedChatroomContext();

  const deleteAttachment = useCallback(async (attachmentId: string) => {
    if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Current chatroom context is not available." };
    } else if (!attachmentId) {
      return { success: false, error: "Attachment ID is required." }
    }

    try {
      const { error } = await supabase.storage
        .from("attachments")
        .remove([`${currentChatroom!.chatroomId}/${attachmentId}`]);

      if (error) {
        throw new Error(error.message || "An unexpected error occurred.");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting attachment:", error);
      return { success: false, error: error.message || "An unexpected error occurred." };
    }
  }, [currentChatroom]);

  const deleteAttachments = useCallback(async (attachmentIds: string[]) => {
    if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Current chatroom context is not available." };
    } else if (!attachmentIds || attachmentIds.length === 0) {
      return { success: false, error: "Attachment IDs are required." };
    }

    try {
      const { error } = await supabase.storage
        .from("attachments")
        .remove(attachmentIds.map(id => `${currentChatroom!.chatroomId}/${id}`));

      if (error) {
        throw new Error(error.message || "An unexpected error occurred.");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting attachments:", error);
      return { success: false, error: error.message || "An unexpected error occurred." };
    }
  }, [currentChatroom]);

  return { deleteAttachment, deleteAttachments };
}