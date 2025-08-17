import { useCallback } from "react";

import { useUnifiedChatroomContext } from "@/hooks";
import { createClient } from "@/utils/supabase/client";

interface fetchAttachmentUrlProps {
  attachmentId: string;
}

const supabase = createClient();

export function useFetchAttachmentUrl() {
  const { currentChatroom } = useUnifiedChatroomContext();

  const fetchAttachmentUrl = useCallback(async ({ attachmentId }: fetchAttachmentUrlProps) => {
    if (!attachmentId) {
      throw new Error("Attachment ID is required.");
    } else if (!currentChatroom?.chatroomId) {
      throw new Error("Chatroom ID is required.");
    }

    try {
      const { data } = await supabase.storage
        .from("attachments")
        .getPublicUrl(`${currentChatroom!.chatroomId}/${attachmentId}`);

      if (!data) {
        throw new Error("No data received from download.");
      }

      return { attachmentUrl: data.publicUrl };
    } catch (error: any) {
      console.error("Error fetching attachment:", error);
      return { attachmentUrl: null, error: error.message || "An unexpected error occurred while fetching the attachment." };
    }
  }, [currentChatroom]);

  return { fetchAttachmentUrl };
}
