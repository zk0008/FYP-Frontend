import { useState, useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import { fetchWithAuth } from "@/utils";
import {
  useToast,
  useUnifiedChatroomContext,
  useUploadAttachment,
  useUserContext
} from "@/hooks";
import { AttachmentInput } from "@/types";

const supabase = createClient();

export function useSendMessage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { currentChatroom } = useUnifiedChatroomContext();
  const { user } = useUserContext();
  const { uploadAttachmentToSupabase } = useUploadAttachment();
  const { toast } = useToast();

  const sendToGroupGPT = useCallback(async ({ content, attachments }: { content: string; attachments?: AttachmentInput[] }): Promise<boolean> => {
    try {
      const contentWithoutMention = content.replace(/@groupgpt/i, "");

      const payload = new FormData();
      payload.append("username", user!.username);
      payload.append("chatroom_id", currentChatroom!.chatroomId);
      payload.append("content", contentWithoutMention);

      if (attachments && attachments.length > 0) {
        attachments.forEach(attachment => {
          payload.append("files", attachment.file);
        });
      }

      const response = await fetchWithAuth("/api/queries/groupgpt", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Error invoking GroupGPT: ${response.statusText}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error sending message to GroupGPT:", error.message);

      toast({
        title: "GroupGPT Invocation Error",
        description: error.message || "An error occurred when invoking GroupGPT.",
        variant: "destructive"
      });
      return false;
    }
  }, [currentChatroom, user]);

  const sendToSupabase = useCallback(async ({ content, attachments }: { content: string; attachments?: AttachmentInput[] }): Promise<{ success: boolean; messageId?: string }> => {
    try {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          chatroom_id: currentChatroom!.chatroomId,
          content: content.trim(),
          sender_id: user!.userId,
          has_attachments: attachments && attachments.length > 0
        })
        .select();

      if (messageError) {
        throw new Error(messageError.message);
      }

      if (attachments && attachments.length > 0) {
        const uploadResults = await Promise.all(
          attachments.map(attachment => uploadAttachmentToSupabase({ messageId: messageData[0].message_id, attachment }))
        );

        if (uploadResults.some(result => !result.success)) {
          throw new Error("Failed to upload attachments");
        }
      }

      return { success: true, messageId: messageData[0].message_id };
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "Message Not Sent",
        description: error.message || "An error occurred when sending the message.",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [currentChatroom, user, toast]);

  const sendMessage = useCallback(async ({ content, attachments } : { content: string, attachments?: AttachmentInput[] }): Promise<boolean> => {
    if (!currentChatroom?.chatroomId || !user?.userId) return false;

    setIsSubmitting(true);

    try {
      const isGroupGPTMessage = content.toLowerCase().includes("@groupgpt");

      if (isGroupGPTMessage) {
        // For GroupGPT messages, send to both Supabase and backend server
        const [groupGPTSuccess, supabaseResult] = await Promise.all([
          sendToGroupGPT({ content: content.trim(), attachments }),
          sendToSupabase({ content: content.trim(), attachments })
        ]);

        // If GroupGPT invocation failed, show error
        if (supabaseResult.success && !groupGPTSuccess && supabaseResult.messageId) {
          const { error } = await supabase
            .from("messages")
            .delete()
            .eq("message_id", supabaseResult.messageId);

          if (error) {
            console.error("Error deleting message after GroupGPT failure:", error.message);
            toast({
              title: "Invocation Failed",
              description: "Message saved but GroupGPT invocation failed. Please try again.",
              variant: "destructive",
              // TODO: Add action to retry GroupGPT (NOT RESEND)
            });
          }

          toast({
            title: "Message Not Sent",
            description: "Failed to invoke GroupGPT. Please try again.",
            variant: "destructive",
          });
          return false;
        } else if (supabaseResult.success && groupGPTSuccess) {
          return true;
        }
      } else {
        // Regular message - only send to Supabase
        const result = await sendToSupabase({ content, attachments });
        if (result.success) {
          return true;
        } else {
          toast({
            title: "Message Not Sent",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      }
    } catch (error: any) {
      console.error("Unexpected error during message sending:", error);
      toast({
        title: "Unexpected Error Sending Message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }

    return false;
  }, [currentChatroom, user, toast, sendToGroupGPT, sendToSupabase]);

  return { isSubmitting, sendMessage };
}
