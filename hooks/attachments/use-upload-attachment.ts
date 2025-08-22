import { useState, useCallback } from "react";

import { AttachmentInput } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { validateFile } from "@/utils";
import { useUnifiedChatroomContext } from "@/hooks";

const supabase = createClient();

export function useUploadAttachment() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { currentChatroom } = useUnifiedChatroomContext();

  const insertAttachmentEntry = useCallback(async ({ messageId, attachment }: { messageId: string, attachment: AttachmentInput }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from("attachments")
        .insert({
          attachment_id: attachment.attachmentId,
          message_id: messageId,
          mime_type: attachment.file.type,
          filename: attachment.filename
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error inserting attachment entry:", error.message);
      return { success: false, error: error.message };
    }
  }, []);

  const uploadAttachmentFile = useCallback(async ({ messageId, attachment }: { messageId: string, attachment: AttachmentInput }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.storage
        .from("attachments")
        .upload(`${currentChatroom!.chatroomId}/${attachment.attachmentId}`, attachment.file, {
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error uploading attachment:", error.message);
      return { success: false, error: error.message };
    }
  }, [currentChatroom]);

  const uploadAttachment = useCallback(async ({ messageId, attachment }: { messageId: string; attachment: AttachmentInput }): Promise<{ success: boolean; error?: string }> => {
    if (!currentChatroom?.chatroomId) {
      return { success: false, error: "Chatroom context is not available" };
    }

    const { isValid, errorMessage } = validateFile(attachment.file);

    if (!isValid) {
      return { success: false, error: errorMessage };
    }

    setIsUploading(true);

    try {
      const [uploadResult, insertResult] = await Promise.all([
        uploadAttachmentFile({ messageId, attachment }),
        insertAttachmentEntry({ messageId, attachment })
      ]);

      if (!uploadResult.success || !insertResult.success) {
        throw new Error("Failed to upload attachment");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error uploading attachment:", error.message);
      return { success: false, error: error.message };
    }
  }, []);

  return { isUploading, uploadAttachment };
}
